const CACHE = 'math-ml-v3';

const FILES = [
  './index.html',
  './Luis_Serrano_Math_for_ML_Week_1_Quiz.html',
  './Luis_Serrano_Math_for_ML_Week_1_Flashcards.html',
  './Luis_Serrano_Math_for_ML_Week_1_Mastery_Guide.html',
  './Luis_Serrano_Math_for_ML_Week_2_Mastery_Guide.html',
  './manifest.json',
  './icon.svg',
  './gmat_db.js',
  './gmat_engine.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first for local files, network-first for CDN resources
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isLocal = url.origin === self.location.origin;

  if (isLocal) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request))
    );
  }
  // CDN requests (KaTeX, Plotly, MathJax) pass through normally
});
