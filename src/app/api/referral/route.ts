import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const referralCode = userId.substring(0, 8).toUpperCase()
    
    const wallet = await db.wallet.findUnique({ where: { userId } })
    let referredUsers: any[] = []
    
    if (wallet) {
      const transactions = await db.walletTransaction.findMany({
        where: {
          walletId: wallet.id,
          reason: 'referral',
          type: 'credit',
          amount: 500
        },
        orderBy: { createdAt: 'desc' }
      })
      
      referredUsers = transactions.map(tx => ({
        id: tx.id,
        amount: tx.amount,
        date: tx.createdAt,
        referredId: tx.referenceId
      }))
    }

    return NextResponse.json({ success: true, referralCode, referredUsers })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { referrerId, referredUserId } = body
    
    if (!referrerId || !referredUserId) {
      return NextResponse.json({ error: 'Missing referrerId or referredUserId' }, { status: 400 })
    }

    // 1. Credit 500 F to referrer's wallet
    let referrerWallet = await db.wallet.findUnique({ where: { userId: referrerId } })
    if (!referrerWallet) {
      referrerWallet = await db.wallet.create({ data: { userId: referrerId, balance: 0 } })
    }
    await db.wallet.update({
      where: { id: referrerWallet.id },
      data: { balance: { increment: 500 } }
    })
    await db.walletTransaction.create({
      data: {
        walletId: referrerWallet.id,
        type: 'credit',
        amount: 500,
        reason: 'referral',
        referenceId: referredUserId
      }
    })

    // 2. Credit 250 F to referred user's wallet
    let referredWallet = await db.wallet.findUnique({ where: { userId: referredUserId } })
    if (!referredWallet) {
      referredWallet = await db.wallet.create({ data: { userId: referredUserId, balance: 0 } })
    }
    await db.wallet.update({
      where: { id: referredWallet.id },
      data: { balance: { increment: 250 } }
    })
    await db.walletTransaction.create({
      data: {
        walletId: referredWallet.id,
        type: 'credit',
        amount: 250,
        reason: 'referral',
        referenceId: referrerId
      }
    })

    // Audit Log for Referrer (System required fallback)
    await db.auditLog.create({
      data: {
        userId: referrerId || 'system',
        action: 'REFERRAL_BONUS_CREDITED',
        entityType: 'wallet',
        entityId: referrerWallet.id,
        changes: JSON.stringify({ amount: 500, referredUser: referredUserId })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
