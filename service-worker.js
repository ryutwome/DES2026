/* DES2026 Service Worker — enables PWA install prompt */
const CACHE_NAME = 'des2026-v12';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  /* Network-first for API calls, cache-first for assets */
  if (event.request.url.includes('workers.dev') || event.request.url.includes('anthropic')) {
    return; /* Let API calls pass through without caching */
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
