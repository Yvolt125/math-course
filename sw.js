const CACHE_NAME = 'hub-v6';

// Assets to cache immediately on install
const PRE_CACHE = [
  './index.html',
  './manifest.json',
  './icon.svg',
  './exercise/index.html',
  './applied-anthropology/index.html',
  './sw.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// "Cache-First" Strategy: Use local copy first, then check for updates in background
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      const fetchPromise = fetch(e.request).then(networkResponse => {
        // Update the cache with the fresh version for next time
        if (networkResponse.ok) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, cacheCopy));
        }
        return networkResponse;
      }).catch(() => {
        // Quietly fail if network is down
      });

      // Return cached version immediately if we have it, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
