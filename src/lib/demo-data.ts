/**
 * Kènè OS — Données de Démonstration Centralisées
 * Utilisées en fallback quand la base de données n'est pas encore peuplée.
 * Permettent au portail Entreprise de s'afficher et fonctionner immédiatement.
 */

export const DEMO_TENANT_ID = 'demo-salon-001';

export const DEMO_TENANT = {
  id: DEMO_TENANT_ID,
  name: 'Institut Beauté Kènè',
  legalName: 'Institut Beauté Kènè SARL',
  type: 'dermo',
  subscriptionTier: 'pro',
  subscriptionStatus: 'active',
  countryCode: 'CI',
  currencyCode: 'XOF',
  rccm: 'CI-ABJ-2024-B-0012345',
  taxId: '2024 12345 M',
  vatRate: 0.18,
  address: JSON.stringify({ street: 'Cocody Riviera 3', city: 'Abidjan', country: 'Côte d\'Ivoire' }),
  active: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
};

export const DEMO_CLIENTS = [
  {
    id: 'client-001',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Awa',
    lastName: 'Koné',
    phone: '+225 07 89 45 12 30',
    email: 'awa.kone@gmail.com',
    skinType: 'mixte',
    fitzpatrickType: 'V',
    allergies: JSON.stringify(['Parabènes', 'Sulfates']),
    treatments: JSON.stringify(['Soin Karité', 'Peeling Enzymatique']),
    consentHealthData: true,
    notes: 'Peau sensible en période d\'harmattan',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date(),
  },
  {
    id: 'client-002',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Fatoumata',
    lastName: 'Diallo',
    phone: '+225 05 34 67 89 00',
    email: 'fatoumata.diallo@yahoo.fr',
    skinType: 'grasse',
    fitzpatrickType: 'VI',
    allergies: JSON.stringify([]),
    treatments: JSON.stringify(['Soin Régulateur Huile de Neem']),
    consentHealthData: true,
    notes: 'Préfère les soins le vendredi matin',
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date(),
  },
  {
    id: 'client-003',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Mariama',
    lastName: 'Traoré',
    phone: '+225 01 23 45 67 89',
    email: 'mariama.traore@outlook.com',
    skinType: 'seche',
    fitzpatrickType: 'IV',
    allergies: JSON.stringify(['Alcool']),
    treatments: JSON.stringify(['Hydratation Intensive Baobab']),
    consentHealthData: true,
    notes: 'Cliente VIP — protocole personnalisé karité-moringa',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date(),
  },
  {
    id: 'client-004',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Adjoua',
    lastName: 'Assouman',
    phone: '+225 07 55 44 33 22',
    email: 'adjoua.assouman@gmail.com',
    skinType: 'sensible',
    fitzpatrickType: 'V',
    allergies: JSON.stringify(['Huiles Essentielles']),
    treatments: JSON.stringify(['Soin Apaisant Camomille']),
    consentHealthData: true,
    notes: 'Réagit aux fragrances synthétiques',
    createdAt: new Date('2024-05-05'),
    updatedAt: new Date(),
  },
  {
    id: 'client-005',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Nafi',
    lastName: 'Coulibaly',
    phone: '+225 01 99 88 77 66',
    email: 'nafi.coulibaly@gmail.com',
    skinType: 'normale',
    fitzpatrickType: 'VI',
    allergies: JSON.stringify([]),
    treatments: JSON.stringify(['Massage Cranien', 'Soin Corps Beurre Cacao']),
    consentHealthData: true,
    notes: 'Préfère les soins en début de semaine',
    createdAt: new Date('2024-06-12'),
    updatedAt: new Date(),
  },
];

export const DEMO_EMPLOYEES = [
  {
    id: 'emp-001',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Adjoua',
    lastName: 'Yao',
    role: 'Esthéticienne Certifiée',
    email: 'adjoua.yao@kene.africa',
    phone: '+225 07 11 22 33 44',
    status: 'active',
    salary: 280000,
    commission: 8,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'emp-002',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Bintou',
    lastName: 'Coulibaly',
    role: 'Dermo-Cosméticienne',
    email: 'bintou@kene.africa',
    phone: '+225 05 99 88 77 66',
    status: 'active',
    salary: 320000,
    commission: 10,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'emp-003',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Reine',
    lastName: 'Assemian',
    role: 'Responsable Labo Botanique',
    email: 'reine@kene.africa',
    phone: '+225 01 55 44 33 22',
    status: 'active',
    salary: 380000,
    commission: 12,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'emp-004',
    tenantId: DEMO_TENANT_ID,
    firstName: 'Mariam',
    lastName: 'Sanogo',
    role: 'Masseuse & Spa',
    email: 'mariam.sanogo@kene.africa',
    phone: '+225 07 33 22 11 00',
    status: 'active',
    salary: 260000,
    commission: 7,
    createdAt: new Date('2024-02-01'),
  },
];

export const DEMO_SERVICES = [
  { id: 'svc-001', tenantId: DEMO_TENANT_ID, name: 'Soin Visage Karité', category: 'Soin Visage', durationMin: 60, price: 25000, description: 'Soin hydratant profond au beurre de karité pur', active: true },
  { id: 'svc-002', tenantId: DEMO_TENANT_ID, name: 'Peeling Enzymatique Papaye', category: 'Exfoliation', durationMin: 75, price: 35000, description: 'Exfoliation douce aux enzymes de papaye africaine', active: true },
  { id: 'svc-003', tenantId: DEMO_TENANT_ID, name: 'Massage Crânien Huile Coco', category: 'Massage', durationMin: 45, price: 20000, description: 'Massage relaxant à l\'huile de coco vierge', active: true },
  { id: 'svc-004', tenantId: DEMO_TENANT_ID, name: 'Soin Corps Beurre Cacao', category: 'Soin Corps', durationMin: 90, price: 40000, description: 'Enveloppement corps au beurre de cacao du Ghana', active: true },
  { id: 'svc-005', tenantId: DEMO_TENANT_ID, name: 'Diagnostic Dermo-Cutané', category: 'Diagnostic', durationMin: 30, price: 15000, description: 'Analyse complète du type et état cutané (Phototype Fitzpatrick)', active: true },
  { id: 'svc-006', tenantId: DEMO_TENANT_ID, name: 'Hydratation Intensive Baobab', category: 'Soin Visage', durationMin: 60, price: 30000, description: 'Soin intense à l\'huile de baobab et aloe vera', active: true },
];

const now = new Date();
export const DEMO_APPOINTMENTS = Array.from({ length: 8 }, (_, i) => {
  const startAt = new Date(now);
  startAt.setHours([9, 10, 11, 12, 14, 15, 16, 17][i], 0, 0, 0);
  const endAt = new Date(startAt);
  endAt.setMinutes(endAt.getMinutes() + 60);
  return {
    id: `appt-today-${i}`,
    tenantId: DEMO_TENANT_ID,
    clientId: DEMO_CLIENTS[i % DEMO_CLIENTS.length].id,
    employeeId: DEMO_EMPLOYEES[i % DEMO_EMPLOYEES.length].id,
    serviceId: DEMO_SERVICES[i % DEMO_SERVICES.length].id,
    client: DEMO_CLIENTS[i % DEMO_CLIENTS.length],
    service: DEMO_SERVICES[i % DEMO_SERVICES.length],
    employee: DEMO_EMPLOYEES[i % DEMO_EMPLOYEES.length],
    startAt,
    endAt,
    status: i < 3 ? 'completed' : 'confirmed',
    amount: DEMO_SERVICES[i % DEMO_SERVICES.length].price,
    notes: 'Protocole dermo-botanique personnalisé',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

export const DEMO_STATS = {
  appointmentsToday: DEMO_APPOINTMENTS.length,
  totalClients: DEMO_CLIENTS.length,
  revenue: 1_850_000,
  activeEmployees: DEMO_EMPLOYEES.filter(e => e.status === 'active').length,
};
