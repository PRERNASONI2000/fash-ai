import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type SVGProps } from 'react'
import { glassPanel } from '../../lib/styles'
import type { GenerationPayload, GenerateApiEnvelope, StatusApiEnvelope } from '../../types/generation'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000'
const API_GENERATE = `${BASE_URL}/api/generate`
const API_UPLOAD_IMAGE = `${BASE_URL}/api/upload-image`
const API_STATUS = (taskId: string) => `${BASE_URL}/api/status/${encodeURIComponent(taskId)}`
const POLL_MS = 5000

async function blobUrlToDataUrl(blobUrl: string): Promise<string> {
  const r = await fetch(blobUrl)
  if (!r.ok) throw new Error('Could not read local image for upload')
  const blob = await r.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Could not encode image as base64'))
    }
    reader.onerror = () => reject(new Error('Could not encode image as base64'))
    reader.readAsDataURL(blob)
  })
}

async function uploadBase64Image(base64Image: string): Promise<string> {
  const res = await fetch(API_UPLOAD_IMAGE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Image }),
  })
  const data = (await res.json()) as { imageUrl?: string; error?: boolean; message?: string; msg?: string }
  if (!res.ok || data.error) {
    const msg = data.message || data.msg || `Image upload failed (${res.status})`
    throw new Error(msg)
  }
  if (!data.imageUrl || typeof data.imageUrl !== 'string') {
    throw new Error('Image upload did not return imageUrl')
  }
  return data.imageUrl
}

async function resolveImageUrlsForGenerate(imageUrls: string[]): Promise<string[]> {
  const hosted: string[] = []
  for (const url of imageUrls) {
    const trimmed = url.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      hosted.push(trimmed)
      continue
    }
    const base64Image = trimmed.startsWith('data:') ? trimmed : await blobUrlToDataUrl(trimmed)
    hosted.push(await uploadBase64Image(base64Image))
  }
  return hosted
}

function pickTaskId(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  const o = body as GenerateApiEnvelope
  const id = o.data?.taskId ?? o.taskId
  return typeof id === 'string' && id.trim() ? id.trim() : null
}

function firstUrlFromField(value: unknown): string | null {
  if (Array.isArray(value) && typeof value[0] === 'string' && value[0]) return value[0]
  if (typeof value === 'string') {
    const s = value.trim()
    if (!s) return null
    try {
      const parsed = JSON.parse(s) as unknown
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') return parsed[0]
      if (typeof parsed === 'string') return parsed
    } catch {
      if (s.startsWith('http')) return s
    }
  }
  return null
}

function pickVideoUrl(data: StatusApiEnvelope['data']): string | null {
  if (!data) return null
  const r = data.response
  return (
    firstUrlFromField(r?.resultUrls) ??
    firstUrlFromField(r?.fullResultUrls) ??
    firstUrlFromField(data.resultUrls)
  )
}

function pickErrorMessage(statusJson: StatusApiEnvelope, data: StatusApiEnvelope['data']): string {
  const fromData = data?.errorMessage
  if (typeof fromData === 'string' && fromData.trim()) return fromData.trim()
  if (statusJson.msg && statusJson.msg !== 'success') return statusJson.msg
  return 'Generation failed'
}

function isTerminalSuccessFlag(flag: number | undefined): boolean {
  if (flag === undefined) return false
  return flag === 1 || flag === 2 || flag === 3
}

function isSuccessFlag(flag: number | undefined): boolean {
  return flag === 1
}

function isErrorFlag(flag: number | undefined): boolean {
  return flag === 2 || flag === 3
}

type Props = {
  payload: GenerationPayload
}

export function GenerationApiIntegration({ payload }: Props) {
  const [busy, setBusy] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const taskIdRef = useRef<string | null>(null)

  const clearPoll = useCallback(() => {
    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => () => clearPoll(), [clearPoll])

  const finishWithError = useCallback(
    (msg: string) => {
      clearPoll()
      taskIdRef.current = null
      setVideoUrl(null)
      setErrorMessage(msg)
      setBusy(false)
    },
    [clearPoll],
  )

  const applyStatusPayload = useCallback(
    (statusJson: StatusApiEnvelope) => {
      const data = statusJson.data
      const flag = data?.successFlag

      if (statusJson.code !== undefined && statusJson.code !== 200) {
        finishWithError(statusJson.msg || `Request failed (${statusJson.code})`)
        return
      }

      if (!isTerminalSuccessFlag(flag)) return

      clearPoll()
      taskIdRef.current = null
      setBusy(false)

      if (isSuccessFlag(flag)) {
        const url = pickVideoUrl(data)
        if (url) {
          setErrorMessage(null)
          setVideoUrl(url)
        } else {
          setVideoUrl(null)
          setErrorMessage('Success, but no video URL was returned')
        }
        return
      }

      if (isErrorFlag(flag)) {
        setVideoUrl(null)
        setErrorMessage(pickErrorMessage(statusJson, data))
        return
      }

      setVideoUrl(null)
      setErrorMessage('Unexpected status')
    },
    [clearPoll, finishWithError],
  )

  const pollOnce = useCallback(
    async (taskId: string) => {
      try {
        const res = await fetch(API_STATUS(taskId))
        const statusJson = (await res.json()) as StatusApiEnvelope
        if (!res.ok && statusJson.code === undefined) {
          finishWithError(statusJson.message || res.statusText || `HTTP ${res.status}`)
          return
        }
        applyStatusPayload(statusJson)
      } catch (e) {
        finishWithError(e instanceof Error ? e.message : 'Status request failed')
      }
    },
    [applyStatusPayload, finishWithError],
  )

  const startPolling = useCallback(
    (taskId: string) => {
      clearPoll()
      taskIdRef.current = taskId
      void pollOnce(taskId)
      intervalRef.current = window.setInterval(() => {
        const id = taskIdRef.current
        if (id) void pollOnce(id)
      }, POLL_MS)
    },
    [clearPoll, pollOnce],
  )

  const handleGenerate = useCallback(async () => {
    clearPoll()
    setVideoUrl(null)
    setErrorMessage(null)
    setBusy(true)
    taskIdRef.current = null

    try {
      let generateBody: GenerationPayload = payload
      if (payload.imageUrls.length > 0) {
        const hostedUrls = await resolveImageUrlsForGenerate(payload.imageUrls)
        generateBody = { ...payload, imageUrls: hostedUrls }
      }

      const res = await fetch(API_GENERATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generateBody),
      })
      const body = (await res.json()) as GenerateApiEnvelope

      if (!res.ok) {
        const msg =
          body.message ||
          (typeof body.msg === 'string' ? body.msg : null) ||
          `HTTP ${res.status}`
        finishWithError(msg)
        return
      }

      const taskId = pickTaskId(body)
      if (!taskId) {
        finishWithError(
          typeof body.msg === 'string' && body.msg
            ? body.msg
            : 'No taskId in response — check API key and request body',
        )
        return
      }

      if (body.code !== undefined && body.code !== 200) {
        finishWithError(body.msg || `Generate failed (code ${body.code})`)
        return
      }

      startPolling(taskId)
    } catch (e) {
      finishWithError(e instanceof Error ? e.message : 'Generate request failed')
    }
  }, [payload, clearPoll, finishWithError, startPolling])

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        layout
        className={`${glassPanel('relative flex min-h-[320px] flex-1 flex-col overflow-hidden p-4 sm:p-5')} lg:min-h-[420px]`}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Preview</p>
          {busy && (
            <span className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-[11px] font-medium text-violet-700 dark:text-violet-300">
              Generating…
            </span>
          )}
        </div>

        <div className="relative flex aspect-video w-full max-h-[480px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/70 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black dark:border-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.25), transparent 40%), radial-gradient(circle at 80% 60%, rgba(236,72,153,0.2), transparent 35%)',
            }}
          />

          <AnimatePresence>
            {busy && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm"
              >
                <motion.div
                  className="h-12 w-12 rounded-full border-2 border-violet-500/30 border-t-violet-600 dark:border-violet-400/30 dark:border-t-violet-400"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                />
                <p className="text-sm font-medium text-zinc-900 dark:text-white">Polling task status every {POLL_MS / 1000}s…</p>
              </motion.div>
            )}
          </AnimatePresence>

          {errorMessage && !busy && (
            <div className="relative z-[1] max-w-md px-6 text-center">
              <p className="text-sm font-semibold text-red-300">Error</p>
              <p className="mt-2 text-sm text-red-200/90">{errorMessage}</p>
            </div>
          )}

          {videoUrl && !busy && !errorMessage && (
            <video
              className="relative z-[1] h-full w-full object-contain"
              src={videoUrl}
              controls
              playsInline
            />
          )}

          {!busy && !errorMessage && !videoUrl && (
            <div className="relative z-[1] flex flex-col items-center gap-2 px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-300 dark:border-white/10 bg-white dark:bg-white/5 text-zinc-700 dark:text-white shadow-sm dark:shadow-inner">
                <PlayGlyph className="h-7 w-7 opacity-90" />
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Video preview</p>
              <p className="max-w-xs text-xs text-zinc-500 dark:text-zinc-400">
                Submit a job with Generate, then the result will appear here when the task completes.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full">
        <button
          type="button"
          disabled={busy}
          onClick={() => void handleGenerate()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 text-lg font-semibold text-white shadow-xl shadow-violet-500/25 outline-none ring-offset-2 transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-violet-500 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 dark:ring-offset-zinc-950"
        >
          <span className="text-2xl font-black tracking-tight">60</span>
          <span>Generate</span>
        </button>
      </motion.div>
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
        POST {API_GENERATE} · poll {API_STATUS('{taskId}')} every {POLL_MS / 1000}s
      </p>
    </div>
  )
}

function PlayGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  )
}
