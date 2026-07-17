import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const diagnosis = await db.diagnosis.findUnique({
      where: { id },
    })

    if (!diagnosis) {
      return NextResponse.json(
        { error: { message: 'Diagnostic introuvable.' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      diagnosis: {
        ...diagnosis,
        photos: JSON.parse(diagnosis.photos),
        subScores: JSON.parse(diagnosis.subScores),
        indicators: JSON.parse(diagnosis.indicators),
        recommendations: JSON.parse(diagnosis.recommendations),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}
