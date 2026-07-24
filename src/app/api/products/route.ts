import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MOCK_BOUTIQUE_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Sérum Magistral Éclat Bissap & Niacinamide 5%',
    salePrice: 18500,
    description: 'Sérum concentré anti-taches PIH pour peaux mélanodermes à l\'extrait d\'Hibiscus bio.',
    category: 'Visage',
    botanical: 'bissap',
    image: '/images/botanical_laboratory_africa.jpg',
    inStock: true,
  },
  {
    id: 'prod_2',
    name: 'Beurre Pur de Karité Brut Filtré de Korhogo (250g)',
    salePrice: 8500,
    description: 'Baume dermo-protecteur 100% pur non-traité, riche en vitamines A, E et F.',
    category: 'Corps',
    botanical: 'karité',
    image: '/images/afro_beauty_hero_woman.jpg',
    inStock: true,
  },
  {
    id: 'prod_3',
    name: 'Huile de Baobab Pure Scellante & Fortifiante (100ml)',
    salePrice: 12500,
    description: 'Huile précieuse de Baobab pour sceller l\'hydratation des cheveux crépi 4C & peaux sèches.',
    category: 'Cheveux',
    botanical: 'baobab',
    image: '/images/african_young_girl_hair.jpg',
    inStock: true,
  },
  {
    id: 'prod_4',
    name: 'Baume Grooming Barbe & Visage Moringa Anti-Boutons',
    salePrice: 14000,
    description: 'Soin apaisant post-rasage anti-inflammatoire enrichi au Moringa et Neem.',
    category: 'Visage',
    botanical: 'moringa',
    image: '/images/afro_man_dermo_care.jpg',
    inStock: true,
  },
  {
    id: 'prod_5',
    name: 'Poudre de Chébé Authentique du Tchad (150g)',
    salePrice: 9500,
    description: 'Rituel traditionnel de renforcement de la fibre capillaire et anti-casse.',
    category: 'Cheveux',
    botanical: 'chebe',
    image: '/images/botanical_laboratory_africa.jpg',
    inStock: true,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const botanical = searchParams.get('botanical');

    const whereClause: any = {
      active: true,
    };

    if (category && category !== 'Tous') {
      whereClause.category = category;
    }

    if (botanical) {
      whereClause.botanical = botanical;
    }

    if (search) {
      whereClause.name = {
        contains: search,
      };
    }

    let products = await db.product.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        salePrice: true,
        description: true,
        category: true,
        botanical: true,
      },
    });

    if (products.length === 0) {
      // Fallback to rich African dermo-botanical mock catalog
      let list = MOCK_BOUTIQUE_PRODUCTS;
      if (category && category !== 'Tous') {
        list = list.filter(p => p.category === category);
      }
      if (botanical) {
        list = list.filter(p => p.botanical === botanical);
      }
      if (search) {
        list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      }
      return NextResponse.json({ success: true, products: list });
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: true, products: MOCK_BOUTIQUE_PRODUCTS });
  }
}
