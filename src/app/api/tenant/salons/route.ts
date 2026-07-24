import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tenants = await db.tenant.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        legalName: true,
        type: true,
        address: true,
        createdAt: true,
      }
    });

    // Default fallback salons if DB is fresh
    const defaultSalons = [
      {
        id: 'salon-abidjan-01',
        name: 'Institut Beauté Awa',
        legalName: 'Institut Beauté Awa SARL',
        type: 'Institut & Spa Dermo',
        address: 'Cocody Riviera 3, Abidjan · Côte d\'Ivoire',
        phone: '+225 07 00 11 22 33',
        rating: '4.9 ⭐',
        services: ['Soin Karité Pur', 'Massage Baobab', 'Diagnostic IA 360°'],
      },
      {
        id: 'salon-dakar-02',
        name: 'Kènè Dermo Spa Dakar',
        legalName: 'Kènè Senegal SUARL',
        type: 'Spa Botanique & Cheveux Afros',
        address: 'Almadies, Dakar · Sénégal',
        phone: '+221 77 000 11 22',
        rating: '5.0 ⭐',
        services: ['Soin Chebe & Moringa', 'Knotless Braids Hydratantes', 'Peeling Doux'],
      }
    ];

    const salons = tenants.length > 0 
      ? tenants.map(t => ({
          id: t.id,
          name: t.name,
          legalName: t.legalName || t.name,
          type: t.type || 'Institut & Spa Dermo',
          address: t.address || 'Abidjan, Côte d\'Ivoire',
          phone: '+225 07 00 00 00',
          rating: '4.9 ⭐',
          services: ['Soin Visage Karité', 'Diagnostic IA', 'Coiffure Afro'],
        }))
      : defaultSalons;

    return NextResponse.json({ success: true, salons });
  } catch (error) {
    console.error('Failed to fetch salons:', error);
    return NextResponse.json({ success: false, error: 'Impossible de charger la liste des salons' }, { status: 500 });
  }
}
