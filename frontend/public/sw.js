const CACHE_NAME = 'superbowl-2026-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/globals.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
  '/_next/static/chunks/app/page.js',
  '/_next/static/chunks/app/layout.js'
];

const API_CACHE_NAME = 'superbowl-api-v1';
const API_TTL = 10 * 1000; // 10 seconds for live data

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API calls differently
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request));
  } else {
    // Handle static assets with cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request)
            .then((response) => {
              // Cache successful responses
              if (response.ok && event.request.method === 'GET') {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            })
            .catch(() => {
              // Return offline page for navigation requests
              if (event.request.destination === 'document') {
                return caches.match('/');
              }
            });
        })
    );
  }
});

// Handle API requests with network-first strategy and short TTL
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Check if cached response is still fresh
  if (cachedResponse) {
    const cachedDate = cachedResponse.headers.get('sw-cached-at');
    if (cachedDate) {
      const age = Date.now() - parseInt(cachedDate);
      if (age < API_TTL) {
        return cachedResponse;
      }
    }
  }
  
  try {
    // Try network first for live data
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the fresh response with timestamp
      const responseClone = networkResponse.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const modifiedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      await cache.put(request, modifiedResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Network failed, trying cache:', error);
  }
  
  // Return cached response if network fails
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline fallback for API requests
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'No network connection and no cached data available',
      timestamp: Date.now()
    }),
    {
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// Background sync for periodic updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Refresh critical API endpoints
      Promise.all([
        fetch('/api/game').then(response => {
          if (response.ok) {
            const cache = caches.open(API_CACHE_NAME);
            return cache.then(c => c.put('/api/game', response));
          }
        })
      ])
    );
  }
});

// Push notification handler (for future use)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New Super Bowl update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Dashboard',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Super Bowl LX Update', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
