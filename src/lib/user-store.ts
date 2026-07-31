/**
 * Kènè OS — Persistent Security & User Registration Verification Store
 * Persists registered accounts to disk & database.
 * Supports flexible phone matching (country codes +225, +221, +223, local 07/05/01).
 */

import fs from 'fs';
import path from 'path';

export interface UserAccount {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: 'admin' | 'gerant' | 'client';
  registeredAt: string;
}

// Environment-safe storage path (uses /tmp on Vercel serverless to avoid EROFS, workspace tmp locally)
const STORAGE_FILE_PATH = process.env.VERCEL
  ? '/tmp/registered_users.json'
  : path.join(process.cwd(), 'tmp', 'registered_users.json');

// Initial Registered Accounts
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
  { id: 'usr-client-09', email: 'client.kene@gmail.com', phone: '+225 07 48 89 42 70', name: 'Cliente Kènè (0748894270)', role: 'client', registeredAt: '2024-07-27' },
];

/**
 * Load persisted accounts from disk
 */
function loadDiskAccounts(): UserAccount[] {
  try {
    if (fs.existsSync(STORAGE_FILE_PATH)) {
      const data = fs.readFileSync(STORAGE_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading registered users disk file:', e);
  }
  return [];
}

/**
 * Save accounts to persistent disk file
 */
function saveDiskAccounts(accounts: UserAccount[]) {
  try {
    const dir = path.dirname(STORAGE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORAGE_FILE_PATH, JSON.stringify(accounts, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving registered users to disk:', e);
  }
}

/**
 * Register a new user account and persist it to disk
 */
export function registerAccount(account: Omit<UserAccount, 'id' | 'registeredAt'>): UserAccount {
  const diskAccounts = loadDiskAccounts();

  const newAccount: UserAccount = {
    id: `usr-reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...account,
    registeredAt: new Date().toISOString(),
  };

  // Filter out duplicates by email or phone
  const updatedDisk = [
    newAccount,
    ...diskAccounts.filter(acc => {
      const sameEmail = account.email && acc.email && cleanIdentifier(acc.email) === cleanIdentifier(account.email);
      const samePhone = account.phone && acc.phone && cleanPhoneDigits(acc.phone) === cleanPhoneDigits(account.phone);
      return !sameEmail && !samePhone;
    })
  ];

  saveDiskAccounts(updatedDisk);
  return newAccount;
}

/**
 * Clean string identifier (lowercased without spaces/dashes)
 */
function cleanIdentifier(id: string): string {
  return id.toLowerCase().trim().replace(/[\s\-\.\(\)]/g, '');
}

/**
 * Extract last 8 digits of phone for robust cross-prefix matching (+225 vs 07)
 */
function cleanPhoneDigits(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 8 ? digitsOnly.slice(-8) : digitsOnly;
}

/**
 * Find registered account by email or phone
 */
export async function findRegisteredAccount(identifier: string): Promise<UserAccount | null> {
  if (!identifier || !identifier.trim()) return null;

  const rawClean = cleanIdentifier(identifier);
  const phoneDigits = cleanPhoneDigits(identifier);
  const isEmail = identifier.includes('@');

  const diskAccounts = loadDiskAccounts();
  const allAccounts = [...diskAccounts, ...INITIAL_REGISTERED_ACCOUNTS];

  // 1. Search in persistent store (Disk + Initial)
  const foundInStore = allAccounts.find(acc => {
    if (isEmail && acc.email) {
      return cleanIdentifier(acc.email) === rawClean;
    }
    if (acc.phone && phoneDigits.length >= 6) {
      const accDigits = cleanPhoneDigits(acc.phone);
      return accDigits === phoneDigits || cleanIdentifier(acc.phone) === rawClean;
    }
    if (acc.email && cleanIdentifier(acc.email) === rawClean) {
      return true;
    }
    return false;
  });

  if (foundInStore) return foundInStore;

  // 2. Search in Prisma database if available
  try {
    const { db } = await import('@/lib/db');

    // Search Client table
    const clients = await db.client.findMany({ take: 100 });
    const foundClient = clients.find(c => {
      if (c.email && isEmail && cleanIdentifier(c.email) === rawClean) return true;
      if (c.phone && phoneDigits.length >= 6 && cleanPhoneDigits(c.phone) === phoneDigits) return true;
      return false;
    });

    if (foundClient) {
      const acc: UserAccount = {
        id: foundClient.id,
        email: foundClient.email || undefined,
        phone: foundClient.phone,
        name: `${foundClient.firstName} ${foundClient.lastName}`.trim(),
        role: 'client',
        registeredAt: foundClient.createdAt.toISOString()
      };
      // Auto-persist into disk for instant future lookups
      registerAccount(acc);
      return acc;
    }

    // Search Tenant / Salon table
    const tenants = await db.tenant.findMany({ take: 100 });
    const foundTenant = tenants.find(t => {
      if (cleanIdentifier(t.name) === rawClean || cleanIdentifier(t.legalName || '') === rawClean) return true;
      return false;
    });

    if (foundTenant) {
      const acc: UserAccount = {
        id: foundTenant.id,
        name: foundTenant.name,
        role: 'gerant',
        registeredAt: foundTenant.createdAt.toISOString()
      };
      registerAccount(acc);
      return acc;
    }
  } catch {
    // Database check fallback
  }

  return null;
}
