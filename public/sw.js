// ── Service Worker — Earth Ranker App Shell Cache ──────────────────────
const CACHE_NAME = 'earthranker-v1';
const OFFLINE_URL = '/';

// Assets that make up the app shell (precached on install)
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ── Install: pre-cache the app shell ─────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        APP_SHELL.map((url) => cache.add(url).catch(() => { }))
      );
    })
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: stale-while-revalidate for navigation, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ✅ Skip caching on localhost during development
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return;

  // ✅ Skip ALL external/cross-origin requests (APIs, CDNs, etc.)  // This prevents the SW from interfering with Claude/Gemini API calls
  if (url.origin !== self.location.origin) return;

  // ✅ Skip chrome-extension requests (fixes the Cache API error)
  if (request.url.startsWith('chrome-extension://')) return;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // For navigation requests use network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(OFFLINE_URL).then((cached) => cached || new Response('Offline', { status: 503 }))
        )
    );
    return;
  }

  // For static assets: cache-first, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});