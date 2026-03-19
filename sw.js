// ═══════════════════════════════════════════════════════════════
// SERVICE WORKER — GitHub Pages Compatible
// Uses relative paths — works on any subdomain/subfolder
// ═══════════════════════════════════════════════════════════════
const CACHE_NAME = 'nursing-app-v4';

// كل الملفات اللي لازم تتخزن للعمل offline — مسارات relative
const STATIC_FILES = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  // Core JS
  './js/core/analytics.js',
  './js/core/router.js',
  './js/core/session.js',
  './js/core/content.js',
  // UI JS
  './js/ui/home.js',
  './js/ui/chapters.js',
  './js/ui/slide.js',
  './js/ui/vocab.js',
  './js/ui/flashcards.js',
  './js/ui/search.js',
  './js/ui/quiz.js',
  './js/ui/progress.js',
  './js/ui/settings.js',
  './js/app.js',
  // Icons
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-72.png',
  './icons/icon-144.png'
];

// ── INSTALL: cache all static files ───────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static files...');
        // Cache files one by one — don't fail all if one fails
        return Promise.allSettled(
          STATIC_FILES.map(url => cache.add(url).catch(err => console.warn('[SW] Failed to cache:', url, err)))
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean old caches ────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      ))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: serve from cache, fallback to network ──
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip Telegram API calls (need network, not cache)
  if (event.request.url.includes('api.telegram.org')) return;

  // Skip Google Fonts (external, cache separately)
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        }).catch(() => cached);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      // Cache first — then update in background
      if (cached) {
        // Update cache in background (stale-while-revalidate)
        fetch(event.request)
          .then(response => {
            if (response.ok) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
            }
          })
          .catch(() => {}); // ignore network errors

        return cached;
      }

      // Not in cache — try network
      return fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Network failed — return index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Offline', { status: 503 });
        });
    })
  );
});
