/**
 * Kènè OS — Security & User Registration Verification Store
 * Strictly verifies whether an email or phone number belongs to a registered account.
 * Rejects login attempts from unregistered users.
 */

export interface UserAccount {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: 'admin' | 'gerant' | 'client';
  registeredAt: string;
}

// Initial Registered Accounts Database
const INITIAL_REGISTERED_ACCOUNTS: UserAccount[] = [
  // Super-Admin Accounts
  { id: 'usr-admin-01', email: 'admin@kene.africa', name: 'Super-Admin SaaS Kènè', role: 'admin', registeredAt: '2024-01-01' },
  { id: 'usr-admin-02', email: 'superadmin@kene.africa', name: 'Direction Kènè', role: 'admin', registeredAt: '2024-01-01' },

  // Enterprise / Salon Accounts
  { id: 'usr-tenant-01', email: 'contact@kene.africa', phone: '+225 07 00 11 22 33', name: 'Institut Beauté Kènè', role: 'gerant', registeredAt: '2024-01-15' },
  { id: 'usr-tenant-02', email: 'contact@salon.com', phone: '+225 07 08 09 10 11', name: 'Salon Pro Partner', role: 'gerant', registeredAt: '2024-01-15' },
  { id: 'usr-tenant-03', email: 'korhogo@kene.africa', phone: '+225 07 08 09 10 12', name: 'Kènè Institute Korhogo', role: 'gerant', registeredAt: '2024-01-15' },
  { id: 'usr-tenant-04', email: 'dakar@kene.africa', phone: '+221 77 123 45 67', name: 'Cabinet La Dermo Dakar', role: 'gerant', registeredAt: '2024-02-01' },
  { id: 'usr-tenant-05', email: 'bamako@kene.africa', phone: '+223 66 99 88 77', name: 'Maison du Karité Bamako', role: 'gerant', registeredAt: '2024-03-10' },

  // Client Accounts
  { id: 'usr-client-01', email: 'awa.kone@example.com', phone: '+225 07 89 45 12 30', name: 'Awa Koné', role: 'client', registeredAt: '2024-01-20' },
  { id: 'usr-client-02', email: 'awa.kone@gmail.com', phone: '+225 07 89 45 12 30', name: 'Awa Koné', role: 'client', registeredAt: '2024-01-20' },
  { id: 'usr-client-03', email: 'fatoumata.diallo@yahoo.fr', phone: '+225 05 34 67 89 00', name: 'Fatoumata Diallo', role: 'client', registeredAt: '2024-02-14' },
  { id: 'usr-client-04', email: 'mariama.traore@outlook.com', phone: '+225 01 23 45 67 89', name: 'Mariama Traoré', role: 'client', registeredAt: '2024-02-10' },
  { id: 'usr-client-05', email: 'adjoua.assouman@gmail.com', phone: '+225 07 55 44 33 22', name: 'Adjoua Assouman', role: 'client', registeredAt: '2024-05-05' },
  { id: 'usr-client-06', email: 'nafi.coulibaly@gmail.com', phone: '+225 01 99 88 77 66', name: 'Nafi Coulibaly', role: 'client', registeredAt: '2024-06-12' },
  { id: 'usr-client-07', email: 'mariam.diallo@gmail.com', phone: '+221 78 456 78 90', name: 'Mariam Diallo', role: 'client', registeredAt: '2024-02-14' },
  { id: 'usr-client-08', email: 'sokhna.ndiaye@yahoo.fr', phone: '+221 77 987 65 43', name: 'Sokhna Ndiaye', role: 'client', registeredAt: '2024-03-01' },
];

// In-memory dynamic register for newly created accounts during runtime
const DYNAMIC_ACCOUNTS: UserAccount[] = [];

/**
 * Register a new user account (Client or Salon)
 */
export function registerAccount(account: Omit<UserAccount, 'id' | 'registeredAt'>): UserAccount {
  const newAccount: UserAccount = {
    id: `usr-reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...account,
    registeredAt: new Date().toISOString(),
  };
  DYNAMIC_ACCOUNTS.push(newAccount);
  return newAccount;
}

/**
 * Normalize phone or email for exact matching
 */
function cleanIdentifier(id: string): string {
  return id.toLowerCase().trim().replace(/[\s\-\.\(\)]/g, '');
}

/**
 * Find registered account by email or phone
 */
export async function findRegisteredAccount(identifier: string): Promise<UserAccount | null> {
  if (!identifier || !identifier.trim()) return null;
  const cleanId = cleanIdentifier(identifier);

  // 1. Check in-memory registered accounts
  const allAccounts = [...INITIAL_REGISTERED_ACCOUNTS, ...DYNAMIC_ACCOUNTS];
  const foundMemory = allAccounts.find(acc => {
    const matchEmail = acc.email && cleanIdentifier(acc.email) === cleanId;
    const matchPhone = acc.phone && cleanIdentifier(acc.phone) === cleanId;
    return matchEmail || matchPhone;
  });

  if (foundMemory) return foundMemory;

  // 2. Check Prisma database if available
  try {
    const { db } = await import('@/lib/db');
    
    // Check Client table
    const dbClient = await db.client.findFirst({
      where: {
        OR: [
          { email: identifier.trim() },
          { phone: identifier.trim() },
        ]
      }
    });
    if (dbClient) {
      return {
        id: dbClient.id,
        email: dbClient.email || undefined,
        phone: dbClient.phone,
        name: `${dbClient.firstName} ${dbClient.lastName}`.trim(),
        role: 'client',
        registeredAt: dbClient.createdAt.toISOString()
      };
    }

    // Check Tenant / Salon table
    const dbTenant = await db.tenant.findFirst({
      where: {
        OR: [
          { name: identifier.trim() },
          { legalName: identifier.trim() },
        ]
      }
    });
    if (dbTenant) {
      return {
        id: dbTenant.id,
        name: dbTenant.name,
        role: 'gerant',
        registeredAt: dbTenant.createdAt.toISOString()
      };
    }
  } catch {
    // Database check failed or uninitialized — fallback to registry
  }

  return null;
}
