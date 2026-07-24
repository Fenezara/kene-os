import { NextResponse } from 'next/server';

export async function GET() {
  // Sample automated e-CNPS social security quarter declarations
  const declarations = [
    {
      id: 'CNPS-2026-Q2',
      quarter: '2026-Q2 (Avril - Juin 2026)',
      totalEmployees: 6,
      grossSalaries: 1850000,
      cnpsPatronal: 143375, // 7.75%
      cnpsSalarial: 66600,   // 3.6%
      workAccident: 37000,   // 2.0%
      familyAllowance: 105450, // 5.7%
      totalDue: 352425,
      status: 'PAYE',
      paidAt: '2026-07-10',
    },
    {
      id: 'CNPS-2026-Q3',
      quarter: '2026-Q3 (Juillet - Septembre 2026)',
      totalEmployees: 6,
      grossSalaries: 1950000,
      cnpsPatronal: 151125,
      cnpsSalarial: 70200,
      workAccident: 39000,
      familyAllowance: 111150,
      totalDue: 371475,
      status: 'EN_ATTENTE',
      dueDate: '2026-10-15',
    }
  ];

  return NextResponse.json({
    success: true,
    declarations,
    currency: 'XOF',
    countryZone: 'UEMOA / e-CNPS'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { quarterId } = body;

    return NextResponse.json({
      success: true,
      message: `Déclaration e-CNPS ${quarterId} validée et transmise à la Caisse de Sécurité Sociale.`,
      paymentReceiptUrl: `/receipts/cnps-${quarterId}.pdf`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
