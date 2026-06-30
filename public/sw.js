const CACHE_NAME = 'blue-belongs-v3'; // Increment version to force update
// Paths use trailing slashes to match the static export (trailingSlash: true).
const urlsToCache = [
  '/',
  '/courses/',
  '/about/',
  '/dashboard/',
  '/faq/',
  '/safety/',
  '/blogs/',
  '/offline.html'
];

// Install Service Worker — precache the app shell, but DON'T skipWaiting:
// the new worker waits until the user opts in (see the SKIP_WAITING message),
// so we never reload someone mid-action.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate the waiting worker on demand (triggered by the refresh prompt)
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Tiered caching strategy:
//  - navigations (HTML): network-first, fall back to cache, then offline.html
//  - same-origin static assets: cache-first (immutable hashed _next assets, images)
//  - cross-origin (API, external images/video): bypass the SW cache entirely
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // Navigations -> network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html'))
        )
    );
    return;
  }

  // Don't touch cross-origin requests (API calls, Unsplash/Pexels media, video)
  if (!sameOrigin) return;

  // Same-origin static assets -> cache-first
  if (/\.(?:js|css|woff2?|png|jpe?g|svg|gif|webp|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // Other same-origin GETs -> network-first, cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Update Service Worker
self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(
    clients.claim().then(() => {
      const cacheWhitelist = [CACHE_NAME];
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      });
    })
  );
});

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New notification from Blue Belong',
    icon: '/icon-192x192.svg',
    badge: '/icon-192x192.svg',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Blue Belongs', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
