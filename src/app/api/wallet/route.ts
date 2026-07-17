import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: { message: 'UserId is required' } }, { status: 400 })
    }

    let wallet = await db.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!wallet) {
      // Lazy create wallet on first view
      wallet = await db.wallet.create({
        data: {
          userId,
          balance: 0.0,
          currencyCode: 'XOF'
        },
        include: {
          transactions: true
        }
      })
    }

    return NextResponse.json({ success: true, wallet })
  } catch (error: any) {
    console.error('[WALLET GET ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, amount } = body

    if (!userId || !amount || parseFloat(amount) <= 0) {
      return NextResponse.json({ error: { message: 'Invalid payload' } }, { status: 400 })
    }

    const depositAmount = parseFloat(amount)

    let wallet = await db.wallet.findUnique({
      where: { userId }
    })

    if (!wallet) {
      wallet = await db.wallet.create({
        data: {
          userId,
          balance: 0.0,
          currencyCode: 'XOF'
        }
      })
    }

    // Perform credit
    const updatedWallet = await db.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: depositAmount } }
    })

    // Log transaction
    const tx = await db.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'credit',
        amount: depositAmount,
        reason: 'topup',
      }
    })

    // Generate accounting double entry: Debit Caisse Mobile Money (5212), Credit Client Wallet liabilities (4191)
    try {
      const tenant = await db.tenant.findFirst()
      if (tenant) {
        const totalEntries = await db.accountingEntry.count({ where: { tenantId: tenant.id } })
        const entryNumber = `ECR-2026-${(totalEntries + 1).toString().padStart(4, '0')}`

        const accountingLines = [
          {
            accountNumber: '5212',
            accountName: 'Banque Mobile Money (Dépôt)',
            debit: depositAmount,
            credit: 0
          },
          {
            accountNumber: '4191',
            accountName: 'Clients, Avances Reçues (Wallet Dépôt)',
            debit: 0,
            credit: depositAmount
          }
        ]

        await db.accountingEntry.create({
          data: {
            tenantId: tenant.id,
            entryNumber,
            journal: 'banque',
            entryDate: new Date(),
            reference: `WALLET-DEP-${tx.id.substring(0, 8)}`,
            description: `Dépôt portefeuille client ${userId}`,
            lines: JSON.stringify(accountingLines),
            status: 'posted'
          }
        })
      }
    } catch (err) {
      console.error('[WALLET DEPOSIT ACCOUNTING FAILED]', err)
    }

    return NextResponse.json({ success: true, wallet: updatedWallet, transaction: tx })
  } catch (error: any) {
    console.error('[WALLET POST ERROR]', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}
