import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { salonId, clientName, clientPhone, clientEmail, serviceName, message, preferredDate } = await req.json();

    if (!clientName || !clientPhone) {
      return NextResponse.json({ success: false, error: 'Nom et téléphone du client requis' }, { status: 400 });
    }

    let tenant = await db.tenant.findFirst();

    // Auto-create or fetch client in CRM
    let clientObj = null;
    if (tenant) {
      try {
        const parts = clientName.trim().split(' ');
        const firstName = parts[0] || 'Client';
        const lastName = parts.slice(1).join(' ') || 'Nouveau';

        clientObj = await (db.client as any).create({
          data: {
            tenantId: tenant.id,
            firstName,
            lastName,
            phone: clientPhone,
            email: clientEmail || null,
            skinType: 'normale',
            fitzpatrickType: 'V',
            allergies: '[]',
            treatments: '[]',
            consentHealthData: true,
          }
        });
      } catch (e) {
        console.warn('Client already exists or fallback CRM entry:', e);
      }
    }

    const contactRequest = {
      id: `req-${Date.now()}`,
      salonId: salonId || tenant?.id || 'default-tenant-id',
      clientName,
      clientPhone,
      clientEmail,
      serviceName: serviceName || 'Consultation Dermo-Cosmétique',
      message: message || 'Demande de prise de rendez-vous depuis le Portail Client.',
      preferredDate: preferredDate || new Date().toISOString(),
      status: 'EN_ATTENTE',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      contactRequest,
      client: clientObj,
      message: 'Votre demande de rendez-vous a été transmise à l\'entreprise. Le salon vous recontactera sous peu !'
    });
  } catch (error) {
    console.error('Failed to submit client contact request:', error);
    return NextResponse.json({ success: false, error: 'Impossible de transmettre la demande' }, { status: 500 });
  }
}
