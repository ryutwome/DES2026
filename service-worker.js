/* DES2026 Service Worker — enables PWA install prompt */
const CACHE_NAME = 'des2026-v18';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './js/data.js',
  './js/state.js',
  './js/api.js',
  './js/voice.js',
  './js/icons.js',
  './js/router.js',
  './js/ui.js',
  './js/screens-setup.js',
  './js/screens-chats.js',
  './js/screens-stories.js',
  './js/screens-communities.js',
  './js/screens-voicerooms.js',
  './js/screens-games.js',
  './js/screens-settings.js',
  './js/init.js',
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
  /* Network-first: always try fresh, fall back to cache if offline */
  event.respondWith(
    fetch(event.request).then((res) => {
      const clone = res.clone();
      caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
      return res;
    }).catch(() => caches.match(event.request))
  );
});
