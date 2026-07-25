import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Kènè OS demo database...');

  // 1. Créer le tenant de démonstration
  const tenant = await db.tenant.upsert({
    where: { id: 'demo-salon-001' },
    create: {
      id: 'demo-salon-001',
      name: 'Institut Beauté Kènè',
      email: 'contact@kene.africa',
      phone: '+225 07 00 11 22 33',
      type: 'Institut & Spa Botanique',
      subscriptionTier: 'Pro',
      country: 'CI',
      city: 'Abidjan',
      address: 'Cocody Riviera 3, Abidjan, Côte d\'Ivoire',
      rccm: 'CI-ABJ-2024-B-0012345',
      nif: '2024 12345 M',
    },
    update: {
      name: 'Institut Beauté Kènè',
    },
  });

  console.log(`✅ Tenant créé : ${tenant.name}`);

  // 2. Créer des clientes de démonstration
  const clients = await Promise.all([
    db.client.upsert({
      where: { id: 'client-001' },
      create: {
        id: 'client-001',
        tenantId: tenant.id,
        firstName: 'Awa',
        lastName: 'Koné',
        phone: '+225 07 89 45 12 30',
        email: 'awa.kone@gmail.com',
        skinType: 'Mixte à tendance déshydratée',
        fitzpatrickType: 'V',
        allergies: '["Parabènes", "Sulfates"]',
        treatments: '["Soin Karité", "Peeling Enzymatique"]',
        consentHealthData: true,
      },
      update: {},
    }),
    db.client.upsert({
      where: { id: 'client-002' },
      create: {
        id: 'client-002',
        tenantId: tenant.id,
        firstName: 'Fatoumata',
        lastName: 'Diallo',
        phone: '+225 05 34 67 89 00',
        email: 'fatoumata.diallo@yahoo.fr',
        skinType: 'Grasse à pores dilatés',
        fitzpatrickType: 'VI',
        allergies: '[]',
        treatments: '["Soin Régulateur Huile de Neem"]',
        consentHealthData: true,
      },
      update: {},
    }),
    db.client.upsert({
      where: { id: 'client-003' },
      create: {
        id: 'client-003',
        tenantId: tenant.id,
        firstName: 'Mariama',
        lastName: 'Traoré',
        phone: '+225 01 23 45 67 89',
        email: 'mariama.traore@outlook.com',
        skinType: 'Sèche à tendance eczémateuse',
        fitzpatrickType: 'IV',
        allergies: '["Alcool"]',
        treatments: '["Hydratation Intensive Baobab"]',
        consentHealthData: true,
      },
      update: {},
    }),
  ]);

  console.log(`✅ ${clients.length} clientes créées`);

  // 3. Créer des employées de démonstration
  const employees = await Promise.all([
    db.employee.upsert({
      where: { id: 'emp-001' },
      create: {
        id: 'emp-001',
        tenantId: tenant.id,
        firstName: 'Adjoua',
        lastName: 'Yao',
        role: 'Esthéticienne Certifiée',
        email: 'adjoua@kene.africa',
        phone: '+225 07 11 22 33 44',
        status: 'active',
        salary: 280000,
        commission: 8,
      },
      update: { status: 'active' },
    }),
    db.employee.upsert({
      where: { id: 'emp-002' },
      create: {
        id: 'emp-002',
        tenantId: tenant.id,
        firstName: 'Bintou',
        lastName: 'Coulibaly',
        role: 'Dermo-Cosméticienne',
        email: 'bintou@kene.africa',
        phone: '+225 05 99 88 77 66',
        status: 'active',
        salary: 320000,
        commission: 10,
      },
      update: { status: 'active' },
    }),
    db.employee.upsert({
      where: { id: 'emp-003' },
      create: {
        id: 'emp-003',
        tenantId: tenant.id,
        firstName: 'Reine',
        lastName: 'Assemian',
        role: 'Responsable Labo',
        email: 'reine@kene.africa',
        phone: '+225 01 55 44 33 22',
        status: 'active',
        salary: 380000,
        commission: 12,
      },
      update: { status: 'active' },
    }),
  ]);

  console.log(`✅ ${employees.length} employées créées`);

  // 4. Créer des rendez-vous pour aujourd'hui
  const today = new Date();
  const rdvHours = [9, 10, 11, 14, 15, 16, 17, 18];
  
  for (let i = 0; i < rdvHours.length; i++) {
    const startAt = new Date(today);
    startAt.setHours(rdvHours[i], 0, 0, 0);
    const endAt = new Date(startAt);
    endAt.setHours(rdvHours[i] + 1, 0, 0, 0);

    await db.appointment.upsert({
      where: { id: `appt-today-${i}` },
      create: {
        id: `appt-today-${i}`,
        tenantId: tenant.id,
        clientId: clients[i % clients.length].id,
        employeeId: employees[i % employees.length].id,
        service: ['Soin Visage Karité', 'Peeling Enzymatique', 'Massage Cranien', 'Soin Corps Beurre de Cacao'][i % 4],
        startAt,
        endAt,
        status: i < 3 ? 'completed' : 'scheduled',
        price: [25000, 35000, 20000, 40000][i % 4],
        notes: 'Protocole dermo-botanique personnalisé',
      },
      update: {},
    });
  }

  console.log(`✅ ${rdvHours.length} rendez-vous du jour créés`);

  // 5. Créer des ventes de démonstration
  for (let i = 0; i < 12; i++) {
    const saleDate = new Date();
    saleDate.setDate(saleDate.getDate() - i);

    await db.sale.upsert({
      where: { id: `sale-${i}` },
      create: {
        id: `sale-${i}`,
        tenantId: tenant.id,
        clientId: clients[i % clients.length].id,
        total: [45000, 72000, 38000, 95000, 55000][i % 5],
        paymentMethod: ['momo', 'cash', 'card', 'wave'][i % 4],
        status: 'completed',
        date: saleDate,
        items: JSON.stringify([
          { label: 'Soin Visage Premium', qty: 1, price: [45000, 72000, 38000, 95000, 55000][i % 5] }
        ]),
      },
      update: {},
    });
  }

  console.log(`✅ 12 ventes de démonstration créées`);

  // 6. Créer des services de démonstration
  const services = [
    { name: 'Soin Visage Karité', price: 25000, duration: 60, category: 'Soin Visage' },
    { name: 'Peeling Enzymatique Papaye', price: 35000, duration: 75, category: 'Exfoliation' },
    { name: 'Massage Crânien Huile Coco', price: 20000, duration: 45, category: 'Massage' },
    { name: 'Soin Corps Beurre Cacao', price: 40000, duration: 90, category: 'Soin Corps' },
    { name: 'Diagnostic Dermo-Cutané', price: 15000, duration: 30, category: 'Diagnostic' },
    { name: 'Hydratation Intensive Baobab', price: 30000, duration: 60, category: 'Soin Visage' },
  ];

  for (const svc of services) {
    await db.service.upsert({
      where: { id: `svc-${svc.name.toLowerCase().replace(/\s+/g, '-')}` },
      create: {
        id: `svc-${svc.name.toLowerCase().replace(/\s+/g, '-')}`,
        tenantId: tenant.id,
        ...svc,
        active: true,
      },
      update: {},
    });
  }

  console.log(`✅ ${services.length} services créés`);

  console.log('\n🎉 Base de données Kènè OS initialisée avec succès !');
  console.log(`   Salon : ${tenant.name}`);
  console.log(`   ${clients.length} clientes | ${employees.length} employées | ${rdvHours.length} RDV aujourd'hui | 12 ventes | ${services.length} services`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
