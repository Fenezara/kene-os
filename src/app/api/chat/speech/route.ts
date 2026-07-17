import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: { message: 'Le texte à convertir en parole est requis.' } },
        { status: 400 }
      )
    }

    try {
      const zai = await ZAI.create()
      const ttsResponse = await zai.audio.tts.create({
        input: text,
        voice: 'shimmer', // Warm voice profile
        response_format: 'mp3',
      })

      if (ttsResponse && ttsResponse.audio_base64) {
        return NextResponse.json({
          success: true,
          audio: `data:audio/mp3;base64,${ttsResponse.audio_base64}`,
        })
      }
    } catch (sdkError: any) {
      console.warn('[KÈNÈ TTS FALLBACK] SDK TTS non configuré ou indisponible.', sdkError.message)
    }

    // Fallback: return the text to speak using Web Speech API on the client
    return NextResponse.json({
      success: true,
      speakText: text,
    })
  } catch (error: any) {
    console.error('[SPEECH API ERROR]', error)
    return NextResponse.json(
      { error: { message: error.message || 'Une erreur interne est survenue.' } },
      { status: 500 }
    )
  }
}
