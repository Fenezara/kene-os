// KÈNÈ OS — High Performance Offline PWA Service Worker
const CACHE_NAME = 'kene-os-cache-v2';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/images/kene_logo.jpg',
  '/images/afro_skin_spectral_scanner.jpg',
  '/images/spectral_mesh_scan_result.png',
  '/portal',
  '/pos',
  '/agenda',
  '/clients',
  '/dashboard',
  '/inventory',
  '/diagnoses',
  '/settings'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Kènè SW] Pré-mise en cache des ressources hors-ligne...');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Kènè SW] Erreur partielle pré-cache (ignorée) :', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET ou API dynamiques
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Stratégie pour les appels API : Réseau uniquement
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Network-First avec Fallback sur le Cache pour la navigation HTML
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const resCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resCopy);
          });
        }
        return response;
      })
      .catch(async () => {
        console.log('[Kènè SW] Connexion hors-ligne : Servir depuis le cache local pour', event.request.url);
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Si aucune correspondance en cache, retourner la page d'accueil ou le portail mis en cache
        const portalFallback = await caches.match('/portal');
        if (portalFallback) return portalFallback;
        return caches.match('/');
      })
  );
});
