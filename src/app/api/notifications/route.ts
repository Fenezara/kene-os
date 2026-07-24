import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const notifications: any[] = []

    // 1. Wallet transactions (cashback, referral)
    const wallet = await db.wallet.findUnique({ where: { userId } })
    if (wallet) {
      const transactions = await db.walletTransaction.findMany({
        where: {
          walletId: wallet.id,
          reason: { in: ['cashback', 'referral'] }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
      
      transactions.forEach(tx => {
        notifications.push({
          id: `tx-${tx.id}`,
          type: 'wallet',
          title: tx.reason === 'cashback' ? 'Cashback Reçu !' : 'Bonus Parrainage',
          message: `Vous avez reçu ${tx.amount} F dans votre portefeuille.`,
          date: tx.createdAt,
          read: false
        })
      })
    }

    // 2. Appointments
    const clientProfiles = await db.client.findMany({ where: { userId } })
    if (clientProfiles.length > 0) {
      for (const client of clientProfiles) {
        const appointments = await db.appointment.findMany({
          where: { clientId: client.id },
          orderBy: { startAt: 'desc' },
          take: 5
        })
        
        appointments.forEach(app => {
          notifications.push({
            id: `app-${app.id}`,
            type: 'appointment',
            title: 'Rappel de Rendez-vous',
            message: `Votre soin en cabine est prévu pour le ${app.startAt.toLocaleDateString('fr-FR')}.`,
            date: app.createdAt,
            read: false
          })
        })
      }
    }

    // 3. Diagnoses
    const diagnoses = await db.diagnosis.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
    
    diagnoses.forEach(diag => {
      notifications.push({
        id: `diag-${diag.id}`,
        type: 'diagnosis',
        title: 'Résultats Diagnostic IA',
        message: `Votre diagnostic (Score : ${diag.scoreGlobal}/100) est prêt.`,
        date: diag.createdAt,
        read: false
      })
    })

    // Sort by date descending and limit 20
    notifications.sort((a, b) => b.date.getTime() - a.date.getTime())
    const limitedNotifications = notifications.slice(0, 20)

    return NextResponse.json({ success: true, notifications: limitedNotifications })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
