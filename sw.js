
const CACHE_NAME = 'ebomba-v1-cloud';
const ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/manifest.json',
  'https://upload.wikimedia.org/wikipedia/commons/8/87/Jabatan_Bomba_dan_Penyelamat_Malaysia.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Gunakan addAll dengan pengendalian ralat supaya satu fail gagal tidak merosakkan semua
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => {
            console.warn('Gagal cache fail:', url, err);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});