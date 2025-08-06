const CACHE_NAME = 'quickfit-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png'
];

// Cache resources during install
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// Push notification handling
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png',
      badge: '/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Open QuickFit',
          icon: '/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/lovable-uploads/1c5d9536-3ab1-4377-bc37-da68da0ce646.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});