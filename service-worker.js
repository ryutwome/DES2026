/* DES2026 Service Worker — enables PWA install prompt */
const CACHE_NAME = 'des2026-v21';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './js/emoji.js',
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
  './emojis/apple.svg','./emojis/blossom.svg','./emojis/books.svg','./emojis/chat.svg',
  './emojis/circle-o.svg','./emojis/cricket.svg','./emojis/eye.svg','./emojis/film.svg',
  './emojis/game.svg','./emojis/grapes.svg','./emojis/herb.svg','./emojis/joker.svg',
  './emojis/kiwi.svg','./emojis/lemon.svg','./emojis/lock.svg','./emojis/mic.svg',
  './emojis/music.svg','./emojis/orange.svg','./emojis/party.svg','./emojis/peach.svg',
  './emojis/phone.svg','./emojis/pineapple.svg','./emojis/pot.svg','./emojis/prayer.svg',
  './emojis/red-circle.svg','./emojis/rose.svg','./emojis/seedling.svg','./emojis/smile.svg',
  './emojis/sparkles.svg','./emojis/strawberry.svg','./emojis/sunrise.svg',
  './emojis/sweat-smile.svg','./emojis/text-abc.svg','./emojis/video.svg',
  './emojis/wave.svg','./emojis/yellow-circle.svg',
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
