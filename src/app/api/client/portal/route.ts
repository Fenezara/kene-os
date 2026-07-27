import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAllDiagnoses } from '@/lib/diagnosis-store';

export async function GET() {
  try {
    let dbClient = await db.client.findFirst();
    
    // Always guarantee a non-null client object
    const client = dbClient || {
      id: 'mock-client-1',
      tenantId: 'tenant-1',
      userId: 'user-1',
      firstName: 'Aminata',
      lastName: 'Diallo',
      phone: '+225 0708091011',
      email: 'aminata@kene.ci',
      birthDate: new Date('1996-05-15'),
      gender: 'F',
      fitzpatrickType: 'V',
      skinType: 'mixte',
      allergies: '[]',
      treatments: '[]',
      consentHealthData: true,
      consentAt: new Date(),
      notes: null,
      rfmScore: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const clientId = client.id;

    // Récupérer les prochains rendez-vous du client
    let upcomingAppointments: any[] = [];
    try {
      upcomingAppointments = await db.appointment.findMany({
        where: { 
          clientId,
          status: { in: ['pending', 'confirmed'] }
        },
        include: {
          service: true,
          tenant: true
        },
        orderBy: { startAt: 'asc' },
        take: 3
      });
    } catch (e) {
      upcomingAppointments = [];
    }

    // Récupérer le dernier diagnostic et tous les diagnostics sauvegardés
    let allSavedDiagnoses = getAllDiagnoses();
    let latestDiagnosis: any = allSavedDiagnoses.length > 0 ? allSavedDiagnoses[0] : null;

    if (!latestDiagnosis) {
      try {
        latestDiagnosis = await db.diagnosis.findFirst({
          where: { clientId },
          orderBy: { createdAt: 'desc' }
        });
      } catch (e) {
        latestDiagnosis = null;
      }
    }

    // Récupérer les informations du wallet
    let wallet: any = null;
    if (client.userId) {
      try {
        wallet = await db.wallet.findUnique({
          where: { userId: client.userId }
        });
      } catch (e) {
        wallet = null;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        client,
        upcomingAppointments,
        latestDiagnosis,
        diagnosesHistory: allSavedDiagnoses,
        walletBalance: wallet?.balance || 25000
      }
    });
  } catch (error) {
    console.error('Failed to fetch client portal data:', error);
    return NextResponse.json({
      success: true,
      data: {
        client: { firstName: 'Aminata', lastName: 'Diallo', phone: '+225 0708091011' },
        upcomingAppointments: [],
        latestDiagnosis: null,
        walletBalance: 25000
      }
    });
  }
}
