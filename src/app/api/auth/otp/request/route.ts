import { NextResponse } from 'next/server'

// Global map to store OTPs during runtime
const globalForOtp = global as unknown as { otpStore: Map<string, { code: string; expires: number }> }
if (!globalForOtp.otpStore) {
  globalForOtp.otpStore = new Map()
}
const otpStore = globalForOtp.otpStore

export async function POST(request: Request) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: { message: 'Numéro de téléphone requis.' } },
        { status: 400 }
      )
    }

    // Generate random 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const otp_request_id = crypto.randomUUID()
    
    // Set expiry to 5 minutes
    const expires = Date.now() + 5 * 60 * 1000

    otpStore.set(otp_request_id, { code, expires })

    console.log(`[KÈNÈ SMS GATEWAY] Code OTP pour ${phone} : ${code} (ID: ${otp_request_id})`)

    return NextResponse.json({
      otp_request_id,
      expires_in: 300,
      simulated_code: code, // Return code to frontend for easier Vibe Testing
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}
