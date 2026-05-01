import { GoogleGenAI } from '@google/genai'

// Inisialisasi Singleton Instance
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string })

// Interfaces
interface MediaData {
  data: string
  mimeType: string
}

interface CallGeminiParams {
  userPrompt: string
  systemInstruction: string
  temperature?: number
  responseAsJson?: boolean
  includeMedia?: MediaData
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Memanggil Gemini dengan auto-retry dan validasi JSON.
 */
export async function callGemini({
  userPrompt,
  systemInstruction,
  temperature = 0.3,
  responseAsJson = true,
  includeMedia,
}: CallGeminiParams): Promise<string> {
  const MAX_RETRIES = 3

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const contents: any[] = []

      if (includeMedia) {
        contents.push({
          inlineData: {
            data: includeMedia.data,
            mimeType: includeMedia.mimeType,
          },
        })
      }

      contents.push(userPrompt)

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature,
          responseMimeType: responseAsJson ? 'application/json' : 'text/plain',
        },
      })

      const responseText = response.text
      if (!responseText) {
        throw new Error('Respon kosong dari Gemini.')
      }

      if (responseAsJson) {
        try {
          let cleanJson = responseText.trim()
          if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim()
          } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim()
          }
          const parsed = JSON.parse(cleanJson)
          return JSON.stringify(parsed)
        } catch {
          throw new Error('Gagal parsing JSON output dari Gemini: ' + responseText)
        }
      }

      return responseText.trim()
    } catch (error: any) {
      const isRetryableError =
        error.message?.includes('429') ||
        error.message?.includes('503') ||
        error.status === 429 ||
        error.status === 503

      if (isRetryableError && attempt < MAX_RETRIES) {
        const waitTime = Math.pow(2, attempt) * 1000
        console.warn(`[Gemini] Error ${error.status || '429/503'}. Retry ${attempt}/${MAX_RETRIES} dalam ${waitTime}ms...`)
        await delay(waitTime)
        continue
      }

      console.error('[Gemini] Gagal memanggil model:', error?.message || error)
      throw new Error(
        error?.message || 'Gagal terhubung ke layanan Gemini AI. Silakan coba lagi.'
      )
    }
  }

  throw new Error('Terjadi kesalahan tak terduga saat memanggil Gemini.')
}
