import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
})

export const MODELS = {
  fast: 'google/gemini-3-flash-preview',
  balanced: 'google/gemini-3-flash-preview',
  powerful: 'anthropic/claude-3-5-sonnet',
} as const

export type ModelKey = keyof typeof MODELS
