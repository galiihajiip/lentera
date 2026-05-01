import { NextRequest, NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'
import { getMultimodalExtractionPrompt } from '@/lib/prompts'

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm']
const MAX_FILE_SIZE = 6 * 1024 * 1024 // 6MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null

    if (!file || !type) {
      return NextResponse.json(
        { success: false, error: 'File dan tipe wajib disertakan.' },
        { status: 400 }
      )
    }

    if (type !== 'image' && type !== 'audio') {
      return NextResponse.json(
        { success: false, error: 'Tipe harus "image" atau "audio".' },
        { status: 400 }
      )
    }

    const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Format file tidak didukung: ${file.type}. Format yang didukung: ${allowedTypes.join(', ')}.`,
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file melebihi batas maksimal 6MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const extractedText = await callGemini({
      userPrompt: 'Extract all text from this file.',
      systemInstruction: getMultimodalExtractionPrompt(),
      includeMedia: {
        data: base64,
        mimeType: file.type,
      },
      responseAsJson: false,
      temperature: 0.1,
    })

    return NextResponse.json({ success: true, extractedText })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Gagal memproses file. Silakan coba lagi.'

    console.error('[Process-Multimodal] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
