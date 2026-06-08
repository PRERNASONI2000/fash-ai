export type GenerationType = 'TEXT_2_VIDEO' | 'REFERENCE_2_VIDEO'

export type ModelId = 'veo3_fast' | 'veo3_quality'

export interface GenerationPayload {
  prompt: string
  imageUrls: string[]
  model: ModelId
  watermark: string
  callBackUrl: string
  aspect_ratio: string
  enableFallback: boolean
  enableTranslation: boolean
  generationType: GenerationType
}

/** Proxied Kie-style JSON from `POST /api/generate` */
export interface GenerateApiEnvelope {
  code?: number
  msg?: string
  data?: { taskId?: string }
  taskId?: string
  error?: boolean
  message?: string
}

/** Proxied Kie-style JSON from `GET /api/status/:taskId` */
export interface StatusRecordData {
  successFlag?: number
  errorMessage?: string | null
  response?: {
    resultUrls?: string[] | string
    fullResultUrls?: string[] | string
  }
  resultUrls?: string[] | string
}

export interface StatusApiEnvelope {
  code?: number
  msg?: string
  data?: StatusRecordData
  error?: boolean
  message?: string
}
