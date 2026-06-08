import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { GenerationApiIntegration } from '../components/generate/GenerationApiIntegration'
import type { GenerationPayload, GenerationType, ModelId } from '../types/generation'
import { glassPanel } from '../lib/styles'

type ImageItem = { id: string; url: string; file: File }

const MODEL_OPTIONS: { id: ModelId; label: string }[] = [
  { id: 'veo3_fast', label: 'Veo 3.1 Fast' },
  { id: 'veo3_quality', label: 'Veo 3.1 Quality' },
]

const GEN_OPTIONS: { id: GenerationType; label: string }[] = [
  { id: 'TEXT_2_VIDEO', label: 'Text to Video' },
  { id: 'REFERENCE_2_VIDEO', label: 'Image to Video' },
]

const ASPECT_OPTIONS = ['16:9', '9:16', '1:1'] as const

const selectClass =
  'mt-1.5 w-full rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2.5 text-sm text-zinc-900 outline-none ring-violet-500/30 transition focus:border-violet-500 focus:ring-4 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:focus:border-violet-400'

const labelClass = 'text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400'

export function GenerateVideo() {
  const id = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [prompt, setPrompt] = useState('Close up shot of woman walking through neon rain')
  const [model, setModel] = useState<ModelId>('veo3_fast')
  const [generationType, setGenerationType] = useState<GenerationType>('REFERENCE_2_VIDEO')
  const [images, setImages] = useState<ImageItem[]>([])
  const [watermark, setWatermark] = useState('MyBrand')
  const [callBackUrl, setCallBackUrl] = useState('http://your-callback-url.com/complete')
  const [aspect_ratio, setAspectRatio] = useState<string>('16:9')
  const [enableFallback, setEnableFallback] = useState(false)
  const [enableTranslation, setEnableTranslation] = useState(true)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const generationPayload: GenerationPayload = useMemo(
    () => ({
      prompt,
      imageUrls: images.map((i) => i.url),
      model,
      watermark,
      callBackUrl,
      aspect_ratio,
      enableFallback,
      enableTranslation,
      generationType,
    }),
    [
      images,
      prompt,
      model,
      watermark,
      callBackUrl,
      aspect_ratio,
      enableFallback,
      enableTranslation,
      generationType,
    ],
  )

  const handleFiles = useCallback((list: FileList | null) => {
    if (!list?.length) return
    const next: ImageItem[] = []
    for (const file of Array.from(list)) {
      if (!file.type.startsWith('image/')) continue
      const url = URL.createObjectURL(file)
      next.push({ id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`, url, file })
    }
    setImages((prev) => [...prev, ...next])
  }, [])

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const item = prev.find((p) => p.id === id)
      if (item) URL.revokeObjectURL(item.url)
      return prev.filter((p) => p.id !== id)
    })
  }, [])

  return (
    <section id="generate" className="scroll-mt-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Generator
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Create your next clip
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Configure model, generation mode, references, and advanced options — preview updates
            on the right.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <motion.div
            layout
            className={`${glassPanel('p-5 sm:p-6')} lg:col-span-5`}
          >
            <div className="space-y-5">
              <div>
                <label htmlFor={`${id}-model`} className={labelClass}>
                  Model type
                </label>
                <select
                  id={`${id}-model`}
                  value={model}
                  onChange={(e) => setModel(e.target.value as ModelId)}
                  className={selectClass}
                >
                  {MODEL_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`${id}-gen`} className={labelClass}>
                  Generation type
                </label>
                <select
                  id={`${id}-gen`}
                  value={generationType}
                  onChange={(e) => setGenerationType(e.target.value as GenerationType)}
                  className={selectClass}
                >
                  {GEN_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className={labelClass}>Reference images</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  Maps to <code className="rounded bg-zinc-200/80 px-1 py-0.5 text-[11px] dark:bg-white/10">imageUrls</code>{' '}
                  in the request payload.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    handleFiles(e.target.files)
                    e.target.value = ''
                  }}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300/90 bg-zinc-50/50 px-4 py-8 text-center transition hover:border-violet-400/60 hover:bg-violet-50/30 dark:border-white/15 dark:bg-white/[0.03] dark:hover:border-violet-400/40 dark:hover:bg-violet-500/5"
                >
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Drop or click to upload
                  </span>
                  <span className="mt-1 text-xs text-zinc-500">PNG, JPG, WebP — multiple files supported</span>
                </motion.button>

                <ul className="mt-3 flex flex-wrap gap-2">
                  <AnimatePresence>
                    {images.map((img) => (
                      <motion.li
                        key={img.id}
                        layout
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="group relative h-16 w-16 overflow-hidden rounded-xl border border-zinc-200/80 dark:border-white/10"
                      >
                        <img src={img.url} alt={img.file.name} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
                        >
                          Remove
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              <div>
                <label htmlFor={`${id}-prompt`} className={labelClass}>
                  Prompt
                </label>
                <textarea
                  id={`${id}-prompt`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  placeholder='e.g. "Close up shot of woman..."'
                  className="mt-1.5 w-full resize-y rounded-2xl border border-zinc-200/80 bg-white/80 px-3 py-3 text-sm text-zinc-900 outline-none ring-violet-500/30 transition placeholder:text-zinc-400 focus:border-violet-500 focus:ring-4 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-400"
                />
              </div>

              <div className="rounded-2xl border border-zinc-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((o) => !o)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-zinc-800 transition hover:bg-white/50 dark:text-zinc-100 dark:hover:bg-white/5"
                >
                  Advanced settings
                  <motion.span animate={{ rotate: advancedOpen ? 180 : 0 }} className="text-zinc-500">
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {advancedOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-zinc-200/60 dark:border-white/10"
                    >
                      <div className="space-y-4 px-4 py-4">
                        <div>
                          <label htmlFor={`${id}-aspect`} className={labelClass}>
                            Aspect ratio
                          </label>
                          <select
                            id={`${id}-aspect`}
                            value={aspect_ratio}
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className={selectClass}
                          >
                            {ASPECT_OPTIONS.map((a) => (
                              <option key={a} value={a}>
                                {a}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor={`${id}-wm`} className={labelClass}>
                            Watermark
                          </label>
                          <input
                            id={`${id}-wm`}
                            value={watermark}
                            onChange={(e) => setWatermark(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2.5 text-sm outline-none ring-violet-500/30 focus:border-violet-500 focus:ring-4 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100"
                          />
                        </div>
                        <div>
                          <label htmlFor={`${id}-cb`} className={labelClass}>
                            Callback URL
                          </label>
                          <input
                            id={`${id}-cb`}
                            value={callBackUrl}
                            onChange={(e) => setCallBackUrl(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-zinc-200/80 bg-white/80 px-3 py-2.5 text-sm outline-none ring-violet-500/30 focus:border-violet-500 focus:ring-4 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100"
                          />
                        </div>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-1 py-1 transition hover:border-violet-500/20 hover:bg-violet-500/5">
                          <input
                            type="checkbox"
                            checked={enableTranslation}
                            onChange={(e) => setEnableTranslation(e.target.checked)}
                            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-900"
                          />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Enable translation</span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-1 py-1 transition hover:border-violet-500/20 hover:bg-violet-500/5">
                          <input
                            type="checkbox"
                            checked={enableFallback}
                            onChange={(e) => setEnableFallback(e.target.checked)}
                            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-900"
                          />
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Enable fallback</span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <GenerationApiIntegration payload={generationPayload} />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
