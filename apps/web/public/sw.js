/* eslint-disable no-restricted-globals */
// ConditionLog Service Worker v1.0.0

var SW_VERSION = '1.0.0';
var CACHE_PREFIX = 'conditionlog';
var STATIC_CACHE = CACHE_PREFIX + '-static-v' + SW_VERSION;
var RUNTIME_CACHE = CACHE_PREFIX + '-runtime-v' + SW_VERSION;

// Static assets to pre-cache on install
var PRECACHE_URLS = [
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
];

// Install — pre-cache shell
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.addAll(PRECACHE_URLS).catch(function () {
        console.warn('[SW] Some precache URLs failed — continuing');
      });
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) {
            return (
              name.indexOf(CACHE_PREFIX) === 0 &&
              name !== STATIC_CACHE &&
              name !== RUNTIME_CACHE
            );
          })
          .map(function (name) {
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch — network-first for API/navigation, cache-first for static assets
self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  // Skip non-GET and external requests
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Skip Supabase / API calls — always network
  if (url.pathname.indexOf('/api/') === 0 || url.pathname.indexOf('/auth/') === 0) {
    return;
  }

  // Static assets (fonts, images, CSS, JS) — cache-first
  if (
    url.pathname.indexOf('/_next/static/') === 0 ||
    url.pathname.indexOf('/_next/image') === 0 ||
    /\.(svg|png|jpg|jpeg|gif|webp|woff2?|css|js)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Navigation / HTML pages — network-first with offline fallback
  var accept = request.headers.get('accept') || '';
  if (request.mode === 'navigate' || accept.indexOf('text/html') !== -1) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // Everything else — network-first
  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

// ---- Strategies ----

function cacheFirst(request, cacheName) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;
    return fetch(request)
      .then(function (response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(cacheName).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(function () {
        return new Response('Offline', { status: 503 });
      });
  });
}

function networkFirst(request, cacheName) {
  return fetch(request)
    .then(function (response) {
      if (response.ok) {
        var clone = response.clone();
        caches.open(cacheName).then(function (cache) {
          cache.put(request, clone);
        });
      }
      return response;
    })
    .catch(function () {
      return caches.match(request).then(function (cached) {
        if (cached) return cached;

        if (request.mode === 'navigate') {
          return new Response(offlineHTML(), {
            headers: { 'Content-Type': 'text/html' },
          });
        }

        return new Response('Offline', { status: 503 });
      });
    });
}

function offlineHTML() {
  return [
    '<!DOCTYPE html><html lang="en"><head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Offline - ConditionLog</title>',
    '<style>',
    '*{margin:0;padding:0;box-sizing:border-box}',
    'body{font-family:system-ui,sans-serif;background:#f8f9fb;color:#1a1a2e;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem;text-align:center}',
    '.card{background:#fff;border-radius:1rem;padding:2.5rem;box-shadow:0 2px 12px rgba(0,0,0,.08);max-width:400px}',
    '.icon{width:64px;height:64px;margin:0 auto 1.5rem;background:#eef0ff;border-radius:1rem;display:flex;align-items:center;justify-content:center}',
    'h1{font-size:1.25rem;margin-bottom:.5rem}',
    'p{color:#666;font-size:.9rem;line-height:1.5}',
    'button{margin-top:1.5rem;background:#3b5dff;color:#fff;border:none;padding:.75rem 2rem;border-radius:.5rem;font-size:.9rem;cursor:pointer}',
    'button:hover{background:#2a4ce0}',
    '</style></head><body><div class="card">',
    '<div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b5dff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>',
    '<h1>You\'re offline</h1>',
    '<p>ConditionLog needs an internet connection to sync your photos and data. Please check your connection and try again.</p>',
    '<button onclick="location.reload()">Try Again</button>',
    '</div></body></html>'
  ].join('');
}
