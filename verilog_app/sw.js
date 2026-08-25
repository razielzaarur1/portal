/* ==========================================================================
   VeriLearn Service Worker (Offline Support)
   ========================================================================== */

const CACHE_NAME = 'verilearn-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/main.css',
  './css/editor.css',
  './js/app.js',
  './js/i18n.js',
  './js/progress.js',
  './js/editor.js',
  './js/simulator.js',
  './js/waveform.js',
  './js/circuit.js',
  './data/curriculum.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
