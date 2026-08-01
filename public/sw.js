// KÈNÈ OS — High Performance Bulletproof PWA Service Worker v3
const CACHE_NAME = 'kene-os-cache-v3';

const PRECACHE_ASSETS = [
  '/',
  '/portal',
  '/pos',
  '/agenda',
  '/clients',
  '/dashboard',
  '/inventory',
  '/diagnoses',
  '/settings',
  '/manifest.json',
  '/images/kene_logo.jpg',
  '/images/afro_skin_spectral_scanner.jpg',
  '/images/spectral_mesh_scan_result.png'
];

// Install Event — Pre-cache core shell pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Kènè SW] Pré-mise en cache des pages et ressources hors-ligne...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[Kènè SW] Pré-cache partiel :', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event — Clean old caches
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

// Fetch Event — Handle network vs cache strategy
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET ou API
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignorer les endpoints API dynamiques
  if (url.pathname.startsWith('/api/')) return;

  // STRATÉGIE 1 : Cache-First pour les assets statiques (_next/static, images, fonts)
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Servir depuis le cache et mettre à jour en arrière-plan si en ligne
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        // Si pas en cache, chercher sur le réseau et mettre en cache
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // STRATÉGIE 2 : Network-First avec Fallback Cache pour la navigation des pages HTML
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      })
      .catch(async () => {
        console.log('[Kènè SW] Mode hors-ligne détecté pour :', event.request.url);
        
        // 1. Chercher une correspondance exacte d'URL dans le cache
        const cachedPage = await caches.match(event.request);
        if (cachedPage) return cachedPage;

        // 2. Chercher sans query parameters
        const cleanUrl = url.origin + url.pathname;
        const cachedClean = await caches.match(cleanUrl);
        if (cachedClean) return cachedClean;

        // 3. Fallback sur le portail ou l'accueil si navigation de page
        if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
          const portalFallback = await caches.match('/portal');
          if (portalFallback) return portalFallback;
          const homeFallback = await caches.match('/');
          if (homeFallback) return homeFallback;
        }

        return new Response('Mode Hors-Ligne Kènè OS : Page temporairement non disponible en cache.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
