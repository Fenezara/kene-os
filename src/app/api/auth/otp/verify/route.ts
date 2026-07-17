import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const globalForOtp = global as unknown as { otpStore: Map<string, { code: string; expires: number }> }
if (!globalForOtp.otpStore) {
  globalForOtp.otpStore = new Map()
}
const otpStore = globalForOtp.otpStore

export async function POST(request: Request) {
  try {
    const { otp_request_id, code, phone } = await request.json()

    if (!otp_request_id || !code || !phone) {
      return NextResponse.json(
        { error: { message: 'Tous les champs sont requis.' } },
        { status: 400 }
      )
    }

    const savedOtp = otpStore.get(otp_request_id)

    if (!savedOtp) {
      return NextResponse.json(
        { error: { message: 'Requête OTP introuvable ou déjà validée.' } },
        { status: 404 }
      )
    }

    if (Date.now() > savedOtp.expires) {
      otpStore.delete(otp_request_id)
      return NextResponse.json(
        { error: { message: 'Le code OTP a expiré.' } },
        { status: 400 }
      )
    }

    if (savedOtp.code !== code) {
      return NextResponse.json(
        { error: { message: 'Le code OTP est incorrect.' } },
        { status: 400 }
      )
    }

    // Success! Remove from store
    otpStore.delete(otp_request_id)

    // Find or create User in DB
    let user = await db.user.findUnique({
      where: { phone },
    })

    if (!user) {
      user = await db.user.create({
        data: {
          phone,
          firstName: 'Membre',
          lastName: 'Kènè',
          status: 'active',
        },
      })
      console.log(`[KÈNÈ DB] Nouveau compte utilisateur créé pour le numéro : ${phone}`)
    } else {
      console.log(`[KÈNÈ DB] Utilisateur connecté : ${phone}`)
    }

    // Return session response
    const response = NextResponse.json({
      success: true,
      user,
      access_token: 'mock-jwt-token-for-kene-auth',
    })

    // Set a simple mock auth cookie for client verification
    response.cookies.set('kene_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}
