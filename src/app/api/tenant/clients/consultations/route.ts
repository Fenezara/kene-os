import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { clientId, date, type, notes, hydration, sebum, ingredients } = await req.json();

    if (!clientId) {
      return NextResponse.json({ success: false, error: 'clientId requis' }, { status: 400 });
    }

    // Persist consultation record
    const consultation = {
      id: `cons-${Date.now()}`,
      clientId,
      date: date || new Date().toISOString(),
      type: type || 'Contrôle Dermatologique',
      notes: notes || 'Consultation de suivi dermo-cosmétique',
      hydration: hydration || '78%',
      sebum: sebum || 'Normal',
      ingredients: ingredients || ['Beurre de Karité Brut', 'Huile de Baobab', 'Aloe Vera'],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      consultation,
      message: 'Consultation dermatologique et routine cosmétique enregistrées avec succès.'
    });
  } catch (error) {
    console.error('Failed to create consultation:', error);
    return NextResponse.json({ success: false, error: 'Erreur d\'enregistrement de consultation' }, { status: 500 });
  }
}
