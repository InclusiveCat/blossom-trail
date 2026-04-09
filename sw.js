// ================================================================
// Blossom Trail Service Worker — PWA Offline Support
// Strategy: Cache-first for static assets, network-first for API calls.
// ================================================================

var CACHE_NAME = 'blossom-trail-v1';
var STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './blossom1.svg',
    './test-van.svg',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Map tile domains cached on-the-fly (not pre-cached due to volume)
var TILE_ORIGINS = [
    'https://a.tile.openstreetmap.org',
    'https://b.tile.openstreetmap.org',
    'https://c.tile.openstreetmap.org',
    'https://a.basemaps.cartocdn.com',
    'https://b.basemaps.cartocdn.com',
    'https://c.basemaps.cartocdn.com'
];

// ── Install: pre-cache static shell
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(STATIC_ASSETS.filter(function(url) {
                // Only pre-cache same-origin and known CDNs
                return true;
            })).catch(function(err) {
                console.warn('[SW] Pre-cache partial failure (non-fatal):', err);
            });
        })
    );
});

// ── Activate: delete old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) { return key !== CACHE_NAME; })
                    .map(function(key) { return caches.delete(key); })
            );
        }).then(function() { return self.clients.claim(); })
    );
});

// ── Fetch: routing strategy
self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);

    // API calls (weather, bloom) — network-first, fall through silently on fail
    if (url.hostname === 'api.open-meteo.com') {
        event.respondWith(
            fetch(event.request).catch(function() {
                return new Response(JSON.stringify({ error: 'offline' }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );
        return;
    }

    // Map tiles — cache-first with network fallback
    var isTile = TILE_ORIGINS.some(function(origin) {
        return url.href.startsWith(origin);
    });
    if (isTile) {
        event.respondWith(
            caches.match(event.request).then(function(cached) {
                if (cached) return cached;
                return fetch(event.request).then(function(response) {
                    if (response && response.status === 200) {
                        var cloned = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, cloned);
                        });
                    }
                    return response;
                }).catch(function() {
                    // Return a transparent 1x1 PNG tile placeholder offline
                    return new Response(
                        atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='),
                        { headers: { 'Content-Type': 'image/png' } }
                    );
                });
            })
        );
        return;
    }

    // Everything else — cache-first, update in background (stale-while-revalidate)
    event.respondWith(
        caches.match(event.request).then(function(cached) {
            var networkFetch = fetch(event.request).then(function(response) {
                if (response && response.status === 200 && event.request.method === 'GET') {
                    var cloned = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, cloned); });
                }
                return response;
            });
            return cached || networkFetch;
        })
    );
});
