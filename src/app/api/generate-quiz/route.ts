import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'
import { getQuizSystemPrompt } from '@/lib/prompts'
import { detectLanguageHint } from '@/lib/languageDetect'
import type { LensType, QuizItem } from '@/types'

const MIN_TEXT_LENGTH = 50
const MAX_TEXT_LENGTH = 5000
const VALID_ANSWERS = new Set(['A', 'B', 'C', 'D'])

function isValidQuizItem(item: unknown): item is QuizItem {
  if (!item || typeof item !== 'object') return false
  const q = item as Record<string, unknown>

  if (typeof q.question !== 'string' || !q.question) return false
  if (!Array.isArray(q.options) || q.options.length !== 4) return false
  if (q.options.some((o: unknown) => typeof o !== 'string' || !o)) return false
  if (typeof q.correctAnswer !== 'string' || !VALID_ANSWERS.has(q.correctAnswer)) return false
  if (typeof q.culturalExplanation !== 'string' || !q.culturalExplanation) return false

  return true
}

function isValidQuizArray(data: unknown): data is QuizItem[] {
  if (!Array.isArray(data) || data.length === 0) return false
  return data.every(isValidQuizItem)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, lens } = body as { text?: string; lens?: LensType }

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Teks materi wajib disertakan.' },
        { status: 400 }
      )
    }

    if (text.length < MIN_TEXT_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Teks terlalu pendek. Minimal ${MIN_TEXT_LENGTH} karakter.` },
        { status: 400 }
      )
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Teks terlalu panjang. Maksimal ${MAX_TEXT_LENGTH} karakter.` },
        { status: 400 }
      )
    }

    if (!lens || typeof lens !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Lensa budaya wajib dipilih.' },
        { status: 400 }
      )
    }

    const detectedLanguage = detectLanguageHint(text)
    const systemPrompt = getQuizSystemPrompt(lens, detectedLanguage)

    const rawResponse = await callGemini({
      userPrompt: text,
      systemInstruction: systemPrompt,
      responseAsJson: true,
      temperature: 0.5,
    })

    const parsed: unknown = JSON.parse(rawResponse)

    if (!isValidQuizArray(parsed)) {
      console.error('[Generate-Quiz] Struktur respons tidak valid:', rawResponse)
      return NextResponse.json(
        { success: false, error: 'Respons AI tidak sesuai format kuis. Silakan coba lagi.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, data: parsed as QuizItem[] })
  } catch (error: any) {
    console.error('[Generate-Quiz] Error:', error?.message || error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Body request harus berupa JSON yang valid.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Gagal menghasilkan kuis. Silakan coba lagi.',
      },
      { status: 500 }
    )
  }
}
