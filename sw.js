const CACHE_NAME = 'elliot-watch-v1';
const ASSETS = [
    './',
    './index.html',
    './css/main.css',
    './js/main.js',
    './assets/elliot.svg',
    './assets/papa.svg',
    './assets/favicon.svg'
];

// Instalación: Cachear archivos estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Estrategia: Cache First, fallback to Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});