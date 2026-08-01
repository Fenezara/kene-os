/**
 * KÈNÈ OS — Moteur de Synchronisation & Persistence Hors-Ligne (Offline PWA Engine)
 * Permet l'utilisation ininterrompue de la Caisse POS, de l'Agenda et du Portail en cas de coupure Internet.
 */

export interface OfflineRecord {
  id: string;
  type: 'sale' | 'appointment' | 'diagnosis' | 'client';
  payload: any;
  timestamp: number;
  synced: boolean;
}

const OFFLINE_QUEUE_KEY = 'kene_offline_sync_queue';

/**
 * Enregistre une action effectuée hors-ligne dans la file de synchronisation
 */
export function enqueueOfflineAction(type: OfflineRecord['type'], payload: any): OfflineRecord {
  const queue = getOfflineQueue();
  const record: OfflineRecord = {
    id: `off_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type,
    payload,
    timestamp: Date.now(),
    synced: false,
  };

  queue.push(record);
  saveOfflineQueue(queue);

  // Essayer de synchroniser immédiatement si la connexion est active
  if (typeof window !== 'undefined' && navigator.onLine) {
    syncOfflineQueue();
  }

  return record;
}

/**
 * Récupère la file d'attente hors-ligne stockée dans localStorage
 */
export function getOfflineQueue(): OfflineRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Erreur lecture queue offline', e);
    return [];
  }
}

/**
 * Sauvegarde la file d'attente hors-ligne
 */
function saveOfflineQueue(queue: OfflineRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Erreur sauvegarde queue offline', e);
  }
}

/**
 * Tente de synchroniser les éléments en attente dès que le réseau réapparaît
 */
export async function syncOfflineQueue(): Promise<{ syncedCount: number; errors: number }> {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return { syncedCount: 0, errors: 0 };
  }

  const queue = getOfflineQueue();
  const pending = queue.filter((item) => !item.synced);

  if (pending.length === 0) {
    return { syncedCount: 0, errors: 0 };
  }

  let syncedCount = 0;
  let errors = 0;

  for (const item of pending) {
    try {
      let endpoint = '';
      if (item.type === 'sale') endpoint = '/api/tenant/sales';
      else if (item.type === 'appointment') endpoint = '/api/tenant/appointments';
      else if (item.type === 'client') endpoint = '/api/tenant/clients';
      else if (item.type === 'diagnosis') endpoint = '/api/tenant/diagnoses';

      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });

        if (res.ok) {
          item.synced = true;
          syncedCount++;
        } else {
          errors++;
        }
      }
    } catch (err) {
      console.error(`Échec synchro offline item ${item.id}:`, err);
      errors++;
    }
  }

  // Filtrer les éléments synchronisés
  const remaining = queue.filter((item) => !item.synced);
  saveOfflineQueue(remaining);

  if (syncedCount > 0 && typeof window !== 'undefined') {
    // Émettre un événement personnalisé pour notifier l'UI
    window.dispatchEvent(new CustomEvent('kene-offline-synced', { detail: { syncedCount } }));
  }

  return { syncedCount, errors };
}

/**
 * Écouteur d'événement réseau global pour auto-synchronisation
 */
export function initOfflineSyncListener() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    console.log('📶 Connexion réseau rétablie : Lancement de la synchronisation des données Kènè...');
    syncOfflineQueue();
  });

  window.addEventListener('offline', () => {
    console.log('⚡ Mode Hors-Ligne activé : Basculement sur la mémoire locale Kènè OS.');
  });
}
