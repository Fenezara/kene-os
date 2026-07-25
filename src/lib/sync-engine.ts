// ─── KÈNÈ GLOBAL REAL-TIME DATA SYNCHRONIZATION ENGINE ─── //

export interface RegisteredTenant {
  id: string;
  name: string;
  type: string;
  country: { code: string; name: string };
  subscriptionTier: string;
  subscriptionStatus: string;
  active: boolean;
  createdAt: string;
  phone?: string;
  email?: string;
  city?: string;
  ownerName?: string;
}

export interface RegisteredClient {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  skinType: string;
  fitzpatrickType: string;
  memberSince: string;
  points: number;
  totalSpent?: number;
  visitsCount?: number;
  registeredAt: string;
}

// Initial Mock Salons / Enterprises
export const DEFAULT_TENANTS: RegisteredTenant[] = [
  {
    id: 'tenant-01',
    name: 'Kènè Institute & Spa Korhogo',
    type: 'Institut & Spa Botanique',
    country: { code: 'CI', name: 'Côte d\'Ivoire' },
    subscriptionTier: 'Pro',
    subscriptionStatus: 'actif',
    active: true,
    createdAt: '2024-01-15T08:00:00Z',
    phone: '+225 07 08 09 10 11',
    email: 'korhogo@kene.africa',
    city: 'Korhogo 🇨🇮',
    ownerName: 'Aminata Coulibaly'
  },
  {
    id: 'tenant-02',
    name: 'Cabinet La Dermo Dakar',
    type: 'Cabinet Dermatologique IA',
    country: { code: 'SN', name: 'Sénégal' },
    subscriptionTier: 'Chaîne',
    subscriptionStatus: 'actif',
    active: true,
    createdAt: '2024-02-01T10:30:00Z',
    phone: '+221 77 123 45 67',
    email: 'dakar@kene.africa',
    city: 'Dakar 🇸🇳',
    ownerName: 'Dr. Ousmane Diop'
  },
  {
    id: 'tenant-03',
    name: 'Maison du Karité Bamako',
    type: 'Centre de Soin Capillaire',
    country: { code: 'ML', name: 'Mali' },
    subscriptionTier: 'Essentiel',
    subscriptionStatus: 'actif',
    active: true,
    createdAt: '2024-03-10T14:15:00Z',
    phone: '+223 66 99 88 77',
    email: 'bamako@kene.africa',
    city: 'Bamako 🇲🇱',
    ownerName: 'Fatoumata Traoré'
  }
];

// Initial Mock Clients
export const DEFAULT_CLIENTS: RegisteredClient[] = [
  {
    id: 'client-01',
    firstName: 'Awa',
    lastName: 'Koné',
    name: 'Awa Koné',
    phone: '+225 07 89 45 12 30',
    email: 'awa.kone@example.com',
    role: 'client',
    skinType: 'Mixte à tendance déshydratée',
    fitzpatrickType: 'Phototype V',
    memberSince: '2024',
    points: 1250,
    totalSpent: 145000,
    visitsCount: 6,
    registeredAt: '2024-01-20T09:00:00Z'
  },
  {
    id: 'client-02',
    firstName: 'Mariam',
    lastName: 'Diallo',
    name: 'Mariam Diallo',
    phone: '+221 78 456 78 90',
    email: 'mariam.diallo@gmail.com',
    role: 'client',
    skinType: 'Grasse acnéique',
    fitzpatrickType: 'Phototype VI',
    memberSince: '2024',
    points: 850,
    totalSpent: 98000,
    visitsCount: 4,
    registeredAt: '2024-02-14T11:20:00Z'
  },
  {
    id: 'client-03',
    firstName: 'Sokhna',
    lastName: 'Ndiaye',
    name: 'Sokhna Ndiaye',
    phone: '+221 77 987 65 43',
    email: 'sokhna.ndiaye@yahoo.fr',
    role: 'client',
    skinType: 'Sèche hyperpigmentée',
    fitzpatrickType: 'Phototype V',
    memberSince: '2024',
    points: 2100,
    totalSpent: 260000,
    visitsCount: 11,
    registeredAt: '2024-03-01T16:45:00Z'
  }
];

// ─── SYNCHRONIZATION HELPERS ─── //

export function getRegisteredTenants(): RegisteredTenant[] {
  if (typeof window === 'undefined') return DEFAULT_TENANTS;
  try {
    const saved = localStorage.getItem('kene_all_tenants');
    if (!saved) {
      localStorage.setItem('kene_all_tenants', JSON.stringify(DEFAULT_TENANTS));
      return DEFAULT_TENANTS;
    }
    const parsed = JSON.parse(saved);
    // Merge default tenants if missing
    const merged = [...parsed];
    DEFAULT_TENANTS.forEach(def => {
      if (!merged.some(t => t.id === def.id || t.name === def.name)) {
        merged.unshift(def);
      }
    });
    return merged;
  } catch {
    return DEFAULT_TENANTS;
  }
}

export function registerNewTenant(newTenant: Partial<RegisteredTenant>): RegisteredTenant {
  const current = getRegisteredTenants();
  const tenant: RegisteredTenant = {
    id: newTenant.id || `tenant-reg-${Date.now()}`,
    name: newTenant.name || 'Nouveau Salon Partner',
    type: newTenant.type || 'Institut & Spa Botanique',
    country: newTenant.country || { code: 'CI', name: 'Côte d\'Ivoire' },
    subscriptionTier: newTenant.subscriptionTier || 'Pro',
    subscriptionStatus: 'actif',
    active: true,
    createdAt: newTenant.createdAt || new Date().toISOString(),
    phone: newTenant.phone || '+225 07 00 00 00 00',
    email: newTenant.email || 'contact@salon-partner.africa',
    city: newTenant.city || 'Abidjan 🇨🇮',
    ownerName: newTenant.ownerName || 'Gérant Salon'
  };

  const updated = [tenant, ...current.filter(t => t.id !== tenant.id && t.name !== tenant.name)];
  if (typeof window !== 'undefined') {
    localStorage.setItem('kene_all_tenants', JSON.stringify(updated));
  }
  return tenant;
}

export function getRegisteredClients(): RegisteredClient[] {
  if (typeof window === 'undefined') return DEFAULT_CLIENTS;
  try {
    const saved = localStorage.getItem('kene_all_clients');
    if (!saved) {
      localStorage.setItem('kene_all_clients', JSON.stringify(DEFAULT_CLIENTS));
      return DEFAULT_CLIENTS;
    }
    const parsed = JSON.parse(saved);
    const merged = [...parsed];
    DEFAULT_CLIENTS.forEach(def => {
      if (!merged.some(c => c.id === def.id || c.email === def.email || c.phone === def.phone)) {
        merged.push(def);
      }
    });
    return merged;
  } catch {
    return DEFAULT_CLIENTS;
  }
}

export function registerNewClient(newClient: Partial<RegisteredClient>): RegisteredClient {
  const current = getRegisteredClients();
  const client: RegisteredClient = {
    id: newClient.id || `client-reg-${Date.now()}`,
    firstName: newClient.firstName || 'Cliente',
    lastName: newClient.lastName || 'Kènè',
    name: `${newClient.firstName || 'Cliente'} ${newClient.lastName || 'Kènè'}`.trim(),
    phone: newClient.phone || '+225 07 00 00 00 00',
    email: newClient.email || 'client@kene.africa',
    role: 'client',
    skinType: newClient.skinType || 'Mixte',
    fitzpatrickType: newClient.fitzpatrickType || 'Phototype V',
    memberSince: '2024',
    points: newClient.points || 500,
    totalSpent: newClient.totalSpent || 25000,
    visitsCount: newClient.visitsCount || 1,
    registeredAt: newClient.registeredAt || new Date().toISOString()
  };

  const updated = [client, ...current.filter(c => c.phone !== client.phone && c.email !== client.email)];
  if (typeof window !== 'undefined') {
    localStorage.setItem('kene_all_clients', JSON.stringify(updated));
  }
  return client;
}

export function deleteTenant(tenantId: string): RegisteredTenant[] {
  const current = getRegisteredTenants();
  const updated = current.filter(t => t.id !== tenantId);
  if (typeof window !== 'undefined') {
    localStorage.setItem('kene_all_tenants', JSON.stringify(updated));
  }
  return updated;
}

export function deleteClient(clientId: string): RegisteredClient[] {
  const current = getRegisteredClients();
  const updated = current.filter(c => c.id !== clientId);
  if (typeof window !== 'undefined') {
    localStorage.setItem('kene_all_clients', JSON.stringify(updated));
  }
  return updated;
}
