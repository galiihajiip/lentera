import { GoogleGenAI } from '@google/genai'

import fs from 'fs';
import path from 'path';

let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiInstance) {
    let apiKey = process.env.GEMINI_API_KEY;
    
    // Fallback: manually read .env.local if not loaded (e.g., server not restarted)
    if (!apiKey) {
      try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const match = envFile.match(/GEMINI_API_KEY=(.+)/);
        if (match && match[1]) {
          let key = match[1].trim();
          if (key.startsWith('"') && key.endsWith('"')) {
            key = key.slice(1, -1);
          } else if (key.startsWith("'") && key.endsWith("'")) {
            key = key.slice(1, -1);
          }
          apiKey = key;
        }
      } catch (err) {
        console.warn("Could not manually read .env.local", err);
      }
    }

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please restart your Next.js server.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}
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

// Helper: Wait for N milliseconds
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Call Gemini with auto-retry and JSON validation features.
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
      // 1. Construct payload content
      const contents: any[] = []
      
      // If there's media, insert it as inlineData (base64) first
      if (includeMedia) {
        contents.push({
          inlineData: {
            data: includeMedia.data,
            mimeType: includeMedia.mimeType,
          },
        })
      }
      
      // Insert text user prompt
      contents.push(userPrompt)

      // 2. Send request to Gemini 2.5 Flash model
      const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: temperature,
          responseMimeType: responseAsJson ? 'application/json' : 'text/plain',
        },
      })

      const responseTeks = response.text
      if (!responseTeks) {
        throw new Error('Empty response from Gemini.')
      }

      // 3. If expecting JSON, assure parseablity
      // then re-stringify for consistent formatting
      if (responseAsJson) {
        try {
          // Clean potential invalid characters from API before JSON.parse
          // Sometimes API returns in markdown block: ```json ... ```
          let cleanJson = responseTeks.trim()
          if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim()
          } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim()
          }

          const parsed = JSON.parse(cleanJson)
          return JSON.stringify(parsed)
        } catch (err) {
          throw new Error('Failed to parse JSON output from Gemini: ' + responseTeks)
        }
      }

      // 4. If plain text, return directly
      return responseTeks.trim()
    } catch (error: any) {
      const isRetryableError =
        error.message?.includes('429') ||
        error.message?.includes('503') ||
        error.status === 429 ||
        error.status === 503

      // If 429 / 503 error and have retries left, wait and repeat
      if (isRetryableError && attempt < MAX_RETRIES) {
        const waitTime = Math.pow(2, attempt) * 1000 // 2s, 4s
        console.warn(`[Gemini] Error ${error.status || '429/503'}. Retrying ${attempt}/${MAX_RETRIES} in ${waitTime}ms...`)
        await delay(waitTime)
        continue
      }

      // If max retries reached or other errors like 400 Bad Request, Exception, etc.
      console.error('[Gemini] Failed to call model:', error?.message || error)
      throw new Error(
        error?.message || 'Failed to connect to Gemini AI services. Please try again later.'
      )
    }
  }

  throw new Error('An unexpected error occurred while calling Gemini.')
}
