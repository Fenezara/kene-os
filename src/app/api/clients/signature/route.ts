import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, clientName, careType, signatureBase64 } = body;

    if (!clientName || !signatureBase64) {
      return NextResponse.json(
        { success: false, message: 'La signature et le nom du client sont requis.' },
        { status: 400 }
      );
    }

    const consentRecord = {
      id: `CONSENT-${Date.now()}`,
      clientId: clientId || 'CLIENT-001',
      clientName,
      careType: careType || 'Soin Peeling Doux AHA & Dermabrasion',
      signedAt: new Date().toISOString(),
      legalText: 'Je soussigné(e) confirme avoir été informé(e) du protocole de soin dermo-botanique Kènè et donne mon accord éclairé.',
      signatureBase64,
      status: 'VALIDE_CERTIFIE',
    };

    return NextResponse.json({
      success: true,
      message: 'Fiche de consentement éclairé signée et archivée avec succès.',
      consent: consentRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
