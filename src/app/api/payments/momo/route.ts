import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, amount, provider, type, referenceId } = body

    if (!userId || !amount || parseFloat(amount) <= 0 || !provider || !type) {
      return NextResponse.json({ error: { message: 'Invalid payload' } }, { status: 400 })
    }

    const depositAmount = parseFloat(amount)

    // Simuler le délai de la demande Push USSD sur le téléphone du client
    await new Promise((resolve) => setTimeout(resolve, 3500))

    let transactionInfo: any = null
    let updatedWallet: any = null

    if (type === 'topup') {
      // 1. Gérer le rechargement de Wallet
      let wallet = await db.wallet.findUnique({ where: { userId } })
      if (!wallet) {
        wallet = await db.wallet.create({
          data: { userId, balance: 0.0, currencyCode: 'XOF' }
        })
      }

      updatedWallet = await db.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: depositAmount } }
      })

      transactionInfo = await db.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'credit',
          amount: depositAmount,
          reason: 'topup',
        }
      })

      // Double Entrée Comptable
      try {
        const tenant = await db.tenant.findFirst()
        if (tenant) {
          const totalEntries = await db.accountingEntry.count({ where: { tenantId: tenant.id } })
          const entryNumber = `ECR-2026-${(totalEntries + 1).toString().padStart(4, '0')}`

          await db.accountingEntry.create({
            data: {
              tenantId: tenant.id,
              entryNumber,
              journal: 'banque',
              entryDate: new Date(),
              reference: `WALLET-MOMO-${transactionInfo.id.substring(0, 8)}`,
              description: `Dépôt Mobile Money (${provider}) portefeuille ${userId}`,
              lines: JSON.stringify([
                { accountNumber: '5212', accountName: 'Banque Mobile Money', debit: depositAmount, credit: 0 },
                { accountNumber: '4191', accountName: 'Clients, Avances Reçues', debit: 0, credit: depositAmount }
              ]),
              status: 'posted'
            }
          })
        }
      } catch (err) {
        console.error('[ACCOUNTING FAILED]', err)
      }
    } else if (type === 'checkout') {
      // 2. Gérer le Checkout Direct d'une Vente (Sale)
      if (!referenceId) {
         return NextResponse.json({ error: { message: 'ReferenceId (Sale ID) missing for checkout' } }, { status: 400 })
      }
      
      const sale = await db.sale.update({
        where: { id: referenceId },
        data: { status: 'paid' }
      })

      transactionInfo = sale

      // Double Entrée Comptable Vente
      try {
        const tenant = await db.tenant.findFirst()
        if (tenant) {
          const totalEntries = await db.accountingEntry.count({ where: { tenantId: tenant.id } })
          const entryNumber = `ECR-2026-${(totalEntries + 1).toString().padStart(4, '0')}`

          await db.accountingEntry.create({
            data: {
              tenantId: tenant.id,
              entryNumber,
              journal: 'banque',
              entryDate: new Date(),
              reference: `SALE-MOMO-${sale.invoiceNumber}`,
              description: `Paiement Mobile Money (${provider}) Vente ${sale.invoiceNumber}`,
              lines: JSON.stringify([
                { accountNumber: '5212', accountName: 'Banque Mobile Money', debit: depositAmount, credit: 0 },
                { accountNumber: '4111', accountName: 'Clients', debit: 0, credit: depositAmount }
              ]),
              status: 'posted'
            }
          })
        }
      } catch (err) {
        console.error('[ACCOUNTING FAILED]', err)
      }
    }

    // 3. Créer l'entité Payment
    const tenant = await db.tenant.findFirst()
    if (tenant) {
       await db.payment.create({
         data: {
           tenantId: tenant.id,
           saleId: type === 'checkout' ? referenceId : null,
           amount: depositAmount,
           method: provider as any,
           status: 'confirmed',
           paidAt: new Date(),
           momoTransactionId: `TXN-${provider.toUpperCase()}-${Math.floor(Math.random() * 1000000)}`,
           metadata: JSON.stringify({ provider, type })
         }
       })
    }

    return NextResponse.json({ 
      success: true, 
      status: 'confirmed',
      transaction: transactionInfo,
      wallet: updatedWallet
    })
  } catch (error: any) {
    console.error('[MOMO API ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
