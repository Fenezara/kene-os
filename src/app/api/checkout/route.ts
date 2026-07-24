import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { userId, items, paymentMethod } = await request.json()

    if (!userId || !items || !items.length || !paymentMethod) {
      return NextResponse.json({ error: { message: 'Invalid payload' } }, { status: 400 })
    }

    // Calcul du total
    const total = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

    // Vérifier le tenant et site par défaut
    const tenant = await db.tenant.findFirst()
    const site = await db.site.findFirst()
    
    // Trouver un employé caissier (fallback)
    let cashier = await db.employee.findFirst({ where: { status: 'active' } })
    
    if (!tenant || !site || !cashier) {
        return NextResponse.json({ error: { message: 'System configuration error' } }, { status: 500 })
    }

    // Récupérer le profil Client
    const client = await db.client.findFirst({ where: { userId } })

    // Générer la vente (Statut pending par défaut)
    const totalSales = await db.sale.count({ where: { tenantId: tenant.id } })
    const invoiceNumber = `FAC-2026-${(totalSales + 1).toString().padStart(5, '0')}`

    const sale = await db.sale.create({
      data: {
        tenantId: tenant.id,
        siteId: site.id,
        clientId: client?.id,
        cashierId: cashier.id,
        invoiceNumber,
        items: JSON.stringify(items),
        subtotal: total,
        vatAmount: 0, // Simplified
        total,
        status: 'pending'
      }
    })

    if (paymentMethod === 'wallet') {
      // 1. Vérifier le solde
      const wallet = await db.wallet.findUnique({ where: { userId } })
      if (!wallet || wallet.balance < total) {
        return NextResponse.json({ error: { message: 'Solde Kènè Pay insuffisant.' } }, { status: 400 })
      }

      // 2. Débiter le wallet
      await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: total } }
      })

      // 3. Log la transaction wallet
      await db.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'debit',
          amount: total,
          reason: 'payment',
          referenceId: sale.id
        }
      })

      // 4. Mettre à jour la vente
      await db.sale.update({
        where: { id: sale.id },
        data: { status: 'paid' }
      })

      // 5. Créer l'entité Paiement
      await db.payment.create({
        data: {
          tenantId: tenant.id,
          saleId: sale.id,
          amount: total,
          method: 'wallet',
          status: 'confirmed',
          paidAt: new Date()
        }
      })

      // Cashback
      const cashback = total * 0.01 // 1%
      await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: cashback } }
      })
      await db.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'credit',
          amount: cashback,
          reason: 'cashback',
          referenceId: sale.id
        }
      })

      return NextResponse.json({ success: true, status: 'paid', sale })
    } else {
      // Mobile Money Flow - Return sale pending so frontend can trigger MoMo API
      return NextResponse.json({ success: true, status: 'pending', sale })
    }

  } catch (error: any) {
    console.error('[CHECKOUT ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
