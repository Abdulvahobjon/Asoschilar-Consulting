const CACHE_NAME = 'asoschilar-v1';
const urlsToCache = [
  '/',
  '/css/main.css',
  '/js/app.js',
  '/img/header/logo.svg',
  '/img/hero/person.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});