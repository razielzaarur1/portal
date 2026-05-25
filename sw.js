const CACHE_NAME = 'study-portal-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/drive.html',
  '/admin.html',
  '/pdf-viewer.html',
  '/data/courses.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .catch(err => console.log('SW install cache error', err))
  );
});

self.addEventListener('fetch', event => {
  // Only intercept GET requests, skip API calls for caching
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
      return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Network successful: clone and cache it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed: fallback to cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
