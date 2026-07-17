import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const tenant = await db.tenant.findFirst()
    if (!tenant) {
      return NextResponse.json({ success: true, notifications: [] })
    }

    const logs = await db.auditLog.findMany({
      where: {
        tenantId: tenant.id,
        action: {
          in: ['send_sms_notification', 'send_whatsapp_notification']
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    const notifications = logs.map((log) => {
      let parsed = { to: '', channel: 'SMS', message: '' }
      try {
        parsed = JSON.parse(log.changes || '{}')
      } catch (e) {
        // Fallback
      }

      return {
        id: log.id,
        to: parsed.to || 'Inconnu',
        channel: parsed.channel || (log.action === 'send_sms_notification' ? 'SMS' : 'WhatsApp'),
        message: parsed.message || '',
        createdAt: log.createdAt,
      }
    })

    return NextResponse.json({ success: true, notifications })
  } catch (error: any) {
    console.error('[PRO NOTIFICATIONS GET ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
