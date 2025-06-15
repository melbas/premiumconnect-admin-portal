
const CACHE_NAME = 'wifi-senegal-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/assets/index.css',
  '/assets/index.js'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache ouvert');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Service Worker: Erreur lors de la mise en cache:', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retourner la réponse
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cloner la réponse
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Retourner une page hors-ligne basique
        return new Response(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Mode Hors-ligne</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>Mode Hors-ligne</h1>
              <p>Vous êtes actuellement hors-ligne. Veuillez vérifier votre connexion internet.</p>
            </body>
          </html>
          `,
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
  );
});
