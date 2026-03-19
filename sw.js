const CACHE = 'math-ml-v3';

const FILES = [
  './index.html',
  './math/week1/quiz.html',
  './math/week1/flashcards.html',
  './math/week1/mastery-guide.html',
  './math/week2/mastery-guide.html',
  './manifest.json',
  './icon.svg',
  './js/gmat-db.js',
  './js/gmat-engine.js'
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
