// Versi Service Worker (update untuk invalidasi cache)
const SW_VERSION = '2.8.1'; // Naikkan versi lagi
const CACHE_NAME = `academic-planner-${SW_VERSION}`;

// Daftar asset yang akan di-cache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  
  // Asset lokal
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/screenshots/desktop.png',
  '/offline.html',

  // Eksternal (cache selama 24 jam)
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
];

// Strategi caching
const CACHE_STRATEGIES = {
  STATIC: 'CacheFirst',
  EXTERNAL: 'StaleWhileRevalidate',
  IMAGES: 'CacheFirst',
  GOOGLE_DRIVE: 'NetworkOnly'
};

// Event Install - Precaching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(PRECACHE_ASSETS); // Cukup cache PRECACHE_ASSETS
      })
      .then(() => self.skipWaiting())
  );
});

// Event Activate - Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Event Fetch - Handling requests
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Bypass non-GET requests
  if (request.method !== 'GET') return;

  // Google Drive Handling
  if (url.href.includes('drive.google.com')) {
    return handleGoogleDrive(event);
  }

  // Strategi berdasarkan tipe request
  if (url.origin === self.location.origin) {
    handleLocalAssets(event);
  } else {
    handleExternalAssets(event);
  }
});

// Handler untuk asset lokal
function handleLocalAssets(event) {
  const request = event.request;
  
  // HTML Documents (Network First)
  if (request.destination === 'document') {
    event.respondWith(
      networkFirst(request)
    );
  }
  // Asset lainnya (Cache First)
  else {
    event.respondWith(
      cacheFirst(request)
    );
  }
}

// Handler untuk asset eksternal
function handleExternalAssets(event) {
  const request = event.request;
  
  // Fonts & CSS (Stale While Revalidate)
  if (request.destination === 'font' || 
      request.destination === 'style' ||
      request.url.includes('fonts.googleapis.com') ||
      request.url.includes('gstatic.com')) { // Tambahkan gstatic.com untuk Firebase SDK
    event.respondWith(
      staleWhileRevalidate(request)
    );
  }
  // Gambar (Cache First)
  else if (request.destination === 'image') {
    event.respondWith(
      cacheFirst(request)
    );
  }
  // Lainnya (Network First)
  else {
    event.respondWith(
      networkFirst(request)
    );
  }
}

// Handler untuk Google Drive
function handleGoogleDrive(event) {
  // Buka di tab baru (tidak di-cache)
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
  }
}

// Strategi Caching: Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  return cachedResponse || fetchAndCache(request, cache);
}

// Strategi Caching: Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || offlineResponse();
  }
}

// Strategi Caching: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const fetchPromise = fetchAndCache(request, cache);
  
  return cachedResponse || fetchPromise;
}

// Helper: Fetch dan cache
async function fetchAndCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return offlineResponse();
  }
}

// Fallback Offline
function offlineResponse() {
  return caches.match('/offline.html');
}

// Background Sync (jika diperlukan)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Implementasi background sync
}
