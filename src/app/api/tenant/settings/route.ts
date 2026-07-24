import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    identity: {
      commercialName: 'Kènè Beauté Pro',
      legalName: 'Kènè SAS',
      type: 'Institut',
      logoUrl: null,
    },
    address: {
      street: 'Plateau, Rue du Commerce',
      phone: '+225 07 00 00 00 00',
      email: 'contact@kene-beaute.com',
    },
    fiscal: {
      rccm: 'CI-ABJ-2023-B-1234',
      nif: '1234567A',
      vatRate: 18,
      country: 'CI',
      currency: 'XOF',
    },
    subscription: {
      plan: 'Pro',
      renewalDate: '2024-12-31',
    }
  });
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    // Simulate save
    console.log('Saved settings:', data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
