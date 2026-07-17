import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params
    const appointment = await db.appointment.findUnique({
      where: { id },
      include: { client: { include: { user: true } } }
    })

    if (!appointment) {
      return NextResponse.json({ error: { message: 'Rendez-vous introuvable.' } }, { status: 404 })
    }

    if (appointment.status === 'cancelled') {
      return NextResponse.json({ error: { message: 'Rendez-vous déjà annulé.' } }, { status: 400 })
    }

    // Cancellation refund calculation algorithm
    const now = new Date()
    const startAt = new Date(appointment.startAt)
    const diffMs = startAt.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    let refundRate = 0.0
    let policyName = 'No-show (< 2h)'

    if (diffHours > 72) {
      refundRate = 1.0
      policyName = 'Annulation libre (> 72h)'
    } else if (diffHours > 24) {
      refundRate = 0.8
      policyName = 'Annulation standard (24h - 72h)'
    } else if (diffHours > 2) {
      refundRate = 0.3
      policyName = 'Annulation tardive (2h - 24h)'
    }

    const depositAmount = appointment.depositAmount
    const refundAmount = Math.round(depositAmount * refundRate)
    const keptAmount = depositAmount - refundAmount

    // Update appointment status
    const updatedAppointment = await db.appointment.update({
      where: { id },
      data: { status: 'cancelled' }
    })

    // If there is refund, credit it to the client's wallet
    if (refundAmount > 0 && appointment.client.user) {
      const user = appointment.client.user
      let wallet = await db.wallet.findUnique({
        where: { userId: user.id }
      })
      if (!wallet) {
        wallet = await db.wallet.create({
          data: {
            userId: user.id,
            balance: 0.0,
            currencyCode: 'XOF'
          }
        })
      }

      await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: refundAmount } }
      })

      await db.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'credit',
          amount: refundAmount,
          reason: 'refund',
          referenceId: appointment.id
        }
      })
    }

    // SYSCOHADA double-entry adjustments
    try {
      const tenant = await db.tenant.findFirst()
      if (tenant && depositAmount > 0) {
        const totalEntries = await db.accountingEntry.count({ where: { tenantId: tenant.id } })
        const entryNumber = `ECR-2026-${(totalEntries + 1).toString().padStart(4, '0')}`

        // Debit client advances for the original deposit amount
        // Credit client advances (refunder portion) or other profits (kept portion)
        const accountingLines = [
          {
            accountNumber: '4191',
            accountName: 'Clients, Avances et Acomptes Reçus (Annulation)',
            debit: depositAmount,
            credit: 0
          }
        ]

        if (refundAmount > 0) {
          accountingLines.push({
            accountNumber: '4191',
            accountName: 'Clients, Avances Reçues (Wallet Remboursement)',
            debit: 0,
            credit: refundAmount
          })
        }

        if (keptAmount > 0) {
          // In SYSCOHADA, kept deposits represent non-refundable penalties / other income
          accountingLines.push({
            accountNumber: '706',
            accountName: 'Prestations de Services (Pénalités Conservées)',
            debit: 0,
            credit: keptAmount
          })
        }

        await db.accountingEntry.create({
          data: {
            tenantId: tenant.id,
            entryNumber,
            journal: 'od',
            entryDate: new Date(),
            reference: `CAN-${appointment.id.substring(0, 8)}`,
            description: `Annulation RDV ${appointment.id.substring(0, 8)} - Rbt: ${refundAmount} F`,
            lines: JSON.stringify(accountingLines),
            status: 'posted'
          }
        })
      }
    } catch (acctErr) {
      console.error('[SYSCOHADA APPOINTMENT CANCEL ACCOUNTING ERROR]', acctErr)
    }

    // Log simulated WhatsApp notification in AuditLog table
    try {
      const tenant = await db.tenant.findFirst()
      if (tenant) {
        const clientPhone = appointment.client.phone
        const clientName = `${appointment.client.firstName} ${appointment.client.lastName}`
        const clientUserId = appointment.client.userId

        const selectedServ = await db.service.findUnique({
          where: { id: appointment.serviceId }
        })
        const serviceName = selectedServ?.name || 'Soin Kènè'

        await db.auditLog.create({
          data: {
            tenantId: tenant.id,
            userId: clientUserId || 'system',
            action: 'send_whatsapp_notification',
            entityType: 'appointment',
            entityId: appointment.id,
            changes: JSON.stringify({
              to: clientPhone,
              channel: 'WhatsApp',
              message: `Salut ${clientName}, votre rendez-vous pour le soin "${serviceName}" le ${new Date(appointment.startAt).toLocaleString('fr-FR')} a été annulé avec succès. ${
                refundAmount > 0 
                  ? `Un remboursement de ${refundAmount.toLocaleString()} F a été crédité sur votre portefeuille Kènè.` 
                  : "L'acompte a été conservé à titre de pénalité tardive."
              } À bientôt.`
            })
          }
        })
      }
    } catch (auditErr) {
      console.error('[WHATSAPP LOG ERROR]', auditErr)
    }

    return NextResponse.json({
      success: true,
      policyName,
      refundRate,
      refundAmount,
      keptAmount,
      appointment: updatedAppointment
    })
  } catch (error: any) {
    console.error('[APPOINTMENT CANCEL ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
