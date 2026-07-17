import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const tenant = await db.tenant.findFirst()
    if (!tenant) {
      return NextResponse.json({ success: true, entries: [] })
    }

    const entries = await db.accountingEntry.findMany({
      where: { tenantId: tenant.id },
      orderBy: { entryDate: 'desc' },
    })

    return NextResponse.json({ success: true, entries })
  } catch (error: any) {
    console.error('[ACCOUNTING GET ERROR]', error)
    return NextResponse.json(
      { error: { message: error.message || 'Une erreur interne est survenue.' } },
      { status: 500 }
    )
  }
}
