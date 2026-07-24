// Service Worker for Kènè (Network-first to prevent stale/blank cache)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((cache) => caches.delete(cache)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Always fetch fresh from network
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
