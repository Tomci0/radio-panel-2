const CACHE_NAME = 'zs14-index-page';
const toCache = [
    '/',
    '/index.html',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.6.1/toastify.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.6.1/toastify.min.js',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(toCache)
            })
            .then(self.skipWaiting())
    )
});