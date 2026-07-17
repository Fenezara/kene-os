import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    let tenant = await db.tenant.findFirst()
    if (!tenant) {
      return NextResponse.json({ success: true, clients: [] })
    }

    const clients = await db.client.findMany({
      where: { tenantId: tenant.id },
      include: {
        appointments: true,
        sales: true,
        user: {
          include: {
            diagnoses: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    const now = new Date()
    const clientsWithRFM = clients.map((client) => {
      // Find latest date of appointments or sales
      const dates = [
        ...client.appointments.map(a => new Date(a.startAt)),
        ...client.sales.map(s => new Date(s.createdAt))
      ]
      
      const recencyDays = dates.length > 0 
        ? Math.max(0, Math.floor((now.getTime() - Math.max(...dates.map(d => d.getTime()))) / (1000 * 60 * 60 * 24)))
        : 999 // fallback for no transaction

      const frequency = client.appointments.length + client.sales.length
      
      const monetary = client.appointments.reduce((sum, a) => sum + a.amount, 0) +
                       client.sales.reduce((sum, s) => sum + s.total, 0)

      // Segment classification
      let segment = 'Prospect'
      if (frequency > 0) {
        if (recencyDays > 120) {
          segment = 'Perdu'
        } else if (recencyDays > 60 && frequency >= 2) {
          segment = 'À risque'
        } else if (frequency >= 4 && monetary >= 50000 && recencyDays <= 30) {
          segment = 'Champion'
        } else if (frequency >= 3 && monetary >= 30000) {
          segment = 'Fidèle'
        } else if (frequency >= 2 && recencyDays <= 45) {
          segment = 'Potentiel'
        } else if (frequency <= 1 && recencyDays <= 15) {
          segment = 'Nouveau'
        } else {
          segment = 'Potentiel'
        }
      }

      return {
        ...client,
        rfm: {
          recencyDays,
          frequency,
          monetary,
          segment
        }
      }
    })

    return NextResponse.json({ success: true, clients: clientsWithRFM })
  } catch (error: any) {
    console.error('[CRM CLIENTS GET ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
