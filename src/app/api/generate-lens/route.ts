import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'
import { getLensSystemPrompt } from '@/lib/prompts'
import { detectLanguageHint } from '@/lib/languageDetect'
import type { LensType, ResultData } from '@/types'

const MIN_TEXT_LENGTH = 50
const MAX_TEXT_LENGTH = 5000

function isValidResultData(data: unknown): data is ResultData {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>

  if (typeof d.dyslexiaFriendlyText !== 'string' || !d.dyslexiaFriendlyText) return false
  if (typeof d.culturalAnalogy !== 'string' || !d.culturalAnalogy) return false
  if (typeof d.examBoundary !== 'string' || !d.examBoundary) return false
  if (!Array.isArray(d.bilingualGlossary) || d.bilingualGlossary.length === 0) return false

  for (const item of d.bilingualGlossary) {
    if (
      !item ||
      typeof item !== 'object' ||
      typeof item.term !== 'string' ||
      typeof item.englishB1 !== 'string' ||
      typeof item.localContext !== 'string'
    ) {
      return false
    }
  }

  return true
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
    const systemPrompt = getLensSystemPrompt(lens, detectedLanguage)

    const rawResponse = await callGemini({
      userPrompt: text,
      systemInstruction: systemPrompt,
      responseAsJson: true,
      temperature: 0.3,
    })

    const parsed: unknown = JSON.parse(rawResponse)

    if (!isValidResultData(parsed)) {
      console.error('[Generate-Lens] Struktur respons tidak valid:', rawResponse)
      return NextResponse.json(
        { success: false, error: 'Respons AI tidak sesuai format. Silakan coba lagi.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, data: parsed as ResultData })
  } catch (error: any) {
    console.error('[Generate-Lens] Error:', error?.message || error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Body request harus berupa JSON yang valid.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Gagal menghasilkan analisis. Silakan coba lagi.',
      },
      { status: 500 }
    )
  }
}
