import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Kènè Pro database seeding...');

  // 1. Countries
  const countryCI = await prisma.country.upsert({
    where: { code: 'CI' },
    update: {},
    create: {
      code: 'CI',
      name: "Côte d'Ivoire",
      currencyCode: 'XOF',
      language: 'fr-CI',
      ohada: true,
      active: true,
      config: JSON.stringify({ vatRate: 0.18, cnpsRate: 0.055, cnpsEmployerRate: 0.109 }),
    },
  });

  const countrySN = await prisma.country.upsert({
    where: { code: 'SN' },
    update: {},
    create: {
      code: 'SN',
      name: 'Sénégal',
      currencyCode: 'XOF',
      language: 'fr-SN',
      ohada: true,
      active: true,
      config: JSON.stringify({ vatRate: 0.18, ipresRate: 0.056, ipresEmployerRate: 0.084 }),
    },
  });

  // 2. Currencies
  await prisma.currency.upsert({
    where: { code: 'XOF' },
    update: {},
    create: { code: 'XOF', name: 'Franc CFA UEMOA', symbol: 'FCFA', decimals: 0 },
  });

  await prisma.currency.upsert({
    where: { code: 'XAF' },
    update: {},
    create: { code: 'XAF', name: 'Franc CFA CEMAC', symbol: 'FCFA', decimals: 0 },
  });

  // 3. MoMo Operators
  await prisma.moMoOperator.upsert({
    where: { code: 'WAVE' },
    update: {},
    create: {
      name: 'Wave Mobile Money',
      code: 'WAVE',
      countries: JSON.stringify(['CI', 'SN', 'BF']),
      commissionRate: 0.01,
      active: true,
    },
  });

  await prisma.moMoOperator.upsert({
    where: { code: 'ORANGE' },
    update: {},
    create: {
      name: 'Orange Money',
      code: 'ORANGE',
      countries: JSON.stringify(['CI', 'SN', 'ML', 'BF']),
      commissionRate: 0.015,
      active: true,
    },
  });

  // 4. Demo Tenant (Salon Kènè Dakar)
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant-demo-dakar' },
    update: {},
    create: {
      id: 'tenant-demo-dakar',
      name: 'Salon Kènè Dakar',
      legalName: 'Kènè Beauté Sénégal SARL',
      type: 'institut',
      countryCode: 'SN',
      currencyCode: 'XOF',
      rccm: 'SN-DKR-2024-B-14920',
      taxId: '009284192',
      vatRate: 0.18,
      address: JSON.stringify({ street: 'Almadies, Route des Almadies', city: 'Dakar', country: 'Sénégal' }),
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
    },
  });

  // 5. Site / Branch
  const site = await prisma.site.upsert({
    where: { id: 'site-dakar-main' },
    update: {},
    create: {
      id: 'site-dakar-main',
      tenantId: tenant.id,
      name: 'Siège Dakar Almadies',
      address: JSON.stringify({ street: 'Route des Almadies', city: 'Dakar' }),
      phone: '+221 33 820 00 00',
    },
  });

  // 6. User Manager
  const user = await prisma.user.upsert({
    where: { phone: '+221770000000' },
    update: {},
    create: {
      phone: '+221770000000',
      email: 'manager@kene.africa',
      firstName: 'Awa',
      lastName: 'Diop',
      language: 'fr-SN',
      status: 'active',
    },
  });

  // Role
  await prisma.userRole.upsert({
    where: { userId_tenantId_role: { userId: user.id, tenantId: tenant.id, role: 'gerant' } },
    update: {},
    create: {
      userId: user.id,
      tenantId: tenant.id,
      role: 'gerant',
      permissions: JSON.stringify(['all']),
    },
  });

  // 7. Employees
  const employee1 = await prisma.employee.upsert({
    where: { id: 'emp-fatou-sarr' },
    update: {},
    create: {
      id: 'emp-fatou-sarr',
      tenantId: tenant.id,
      siteId: site.id,
      firstName: 'Fatou',
      lastName: 'Sarr',
      birthDate: new Date('1995-04-12'),
      gender: 'F',
      phone: '+221771112233',
      email: 'fatou.sarr@kene.africa',
      address: JSON.stringify({ city: 'Dakar' }),
      hireDate: new Date('2023-01-15'),
      contractType: 'CDI',
      position: 'Master Coiffeuse & Styliste',
      baseSalary: 250000,
      documents: JSON.stringify([]),
      status: 'active',
    },
  });

  const employee2 = await prisma.employee.upsert({
    where: { id: 'emp-aminata-diallo' },
    update: {},
    create: {
      id: 'emp-aminata-diallo',
      tenantId: tenant.id,
      siteId: site.id,
      firstName: 'Aminata',
      lastName: 'Diallo',
      birthDate: new Date('1998-08-22'),
      gender: 'F',
      phone: '+221772223344',
      email: 'aminata.diallo@kene.africa',
      address: JSON.stringify({ city: 'Dakar' }),
      hireDate: new Date('2023-06-01'),
      contractType: 'CDI',
      position: 'Esthéticienne & Dermo-Praticienne',
      baseSalary: 220000,
      documents: JSON.stringify([]),
      status: 'active',
    },
  });

  // 8. Clients
  const client1 = await prisma.client.upsert({
    where: { id: 'client-ndeye-konate' },
    update: {},
    create: {
      id: 'client-ndeye-konate',
      tenantId: tenant.id,
      firstName: 'Ndeye',
      lastName: 'Konaté',
      phone: '+221774445566',
      email: 'ndeye.konate@gmail.com',
      fitzpatrickType: 'VI',
      skinType: 'mixte',
      allergies: JSON.stringify(['Arachide']),
      treatments: JSON.stringify(['Soin Visage Hydratant au Karité']),
      consentHealthData: true,
      notes: 'Préfère les tresses Knotless moyennes.',
    },
  });

  const client2 = await prisma.client.upsert({
    where: { id: 'client-mariam-coulibaly' },
    update: {},
    create: {
      id: 'client-mariam-coulibaly',
      tenantId: tenant.id,
      firstName: 'Mariam',
      lastName: 'Coulibaly',
      phone: '+221775556677',
      email: 'mariam.c@gmail.com',
      fitzpatrickType: 'V',
      skinType: 'seche',
      allergies: JSON.stringify([]),
      treatments: JSON.stringify(['Massage Relaxant à l\'Huile de Baobab']),
      consentHealthData: true,
      notes: 'Fidèle depuis 2 ans.',
    },
  });

  // 9. Services
  const service1 = await prisma.service.upsert({
    where: { id: 'srv-tresse-knotless' },
    update: {},
    create: {
      id: 'srv-tresse-knotless',
      tenantId: tenant.id,
      name: 'Tresses Knotless Braids Premium',
      description: 'Coiffure de tresses légères sans nœud pour préserver le cuir chevelu.',
      category: 'Coiffure',
      durationMin: 180,
      price: 35000,
      vatRate: 0.18,
      commissionRate: 15.0,
      resourcesRequired: JSON.stringify(['Fauteuil Coiffure']),
      active: true,
    },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 'srv-soin-visage-karite' },
    update: {},
    create: {
      id: 'srv-soin-visage-karite',
      tenantId: tenant.id,
      name: 'Soin Visage Hydratant au Karité Pur',
      description: 'Soin nourrissant et réparateur pour peaux mélanodermes (Phototypes V & VI).',
      category: 'Soin Visage',
      durationMin: 60,
      price: 25000,
      vatRate: 0.18,
      commissionRate: 10.0,
      resourcesRequired: JSON.stringify(['Cabine Soin']),
      active: true,
    },
  });

  // 10. Products & Stock
  const product1 = await prisma.product.upsert({
    where: { id: 'prod-beurre-karite-250g' },
    update: {},
    create: {
      id: 'prod-beurre-karite-250g',
      tenantId: tenant.id,
      sku: 'KAR-250G',
      name: 'Beurre de Karité Pur Bio (250g)',
      description: 'Beurre brut pressé à froid certifié équitable.',
      category: 'Soins Botaniques',
      botanical: 'Karité',
      purchasePrice: 4000,
      salePrice: 10000,
      vatRate: 0.18,
      threshold: 5,
      active: true,
    },
  });

  await prisma.inventoryItem.upsert({
    where: { siteId_productId: { siteId: site.id, productId: product1.id } },
    update: { quantity: 24 },
    create: {
      tenantId: tenant.id,
      siteId: site.id,
      productId: product1.id,
      quantity: 24,
    },
  });

  // 11. Appointments
  await prisma.appointment.upsert({
    where: { id: 'apt-demo-1' },
    update: {},
    create: {
      id: 'apt-demo-1',
      tenantId: tenant.id,
      siteId: site.id,
      clientId: client1.id,
      serviceId: service1.id,
      employeeId: employee1.id,
      startAt: new Date(Date.now() + 86400000),
      endAt: new Date(Date.now() + 86400000 + 10800000),
      status: 'confirmed',
      amount: 35000,
      depositAmount: 10000,
      source: 'online',
      notes: 'Demande mèches couleur #30.',
    },
  });

  // 12. Accounting Entries (SYSCOHADA)
  await prisma.accountingEntry.upsert({
    where: { id: 'entry-ventes-aug-01' },
    update: {},
    create: {
      id: 'entry-ventes-aug-01',
      tenantId: tenant.id,
      entryNumber: 'ECR-2026-0801',
      journal: 'ventes',
      entryDate: new Date(),
      reference: 'FAC-2026-0048',
      description: 'Vente Prestation Soin Visage Karité & Beurre 250g',
      status: 'posted',
      lines: JSON.stringify([
        { accountNumber: '5711', accountName: 'Caisse Principale', debit: 35000, credit: 0 },
        { accountNumber: '706', accountName: 'Prestations de Soins', debit: 0, credit: 25000 },
        { accountNumber: '701', accountName: 'Ventes de Cosmétiques', debit: 0, credit: 5339 },
        { accountNumber: '4431', accountName: 'État, TVA Collectée (18%)', debit: 0, credit: 4661 },
      ]),
    },
  });

  console.log('✅ Kènè Pro database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
