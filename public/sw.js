const CACHE_NAME = "vc-icebreaker-v2";
const ASSETS = ["/", "/style.css", "/script.js", "/manifest.json"];

self.addEventListener("install", (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Stale-while-revalidate strategy with safer cloning
self.addEventListener("fetch", (e) => {
    const req = e.request;

    // Only handle GET HTTP(S) requests; let others pass through untouched
    if (req.method !== "GET" || !(req.url.startsWith("http://") || req.url.startsWith("https://"))) {
        return;
    }

    e.respondWith(
        caches.match(req).then((cachedResponse) => {
            const fetchPromise = fetch(req)
                .then((networkResponse) => {
                    // Some responses (e.g. opaque, error) can't be cloned/put safely
                    if (!networkResponse || !networkResponse.ok || networkResponse.type === "opaque") {
                        return networkResponse;
                    }
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(req, responseClone))
                        .catch(() => { /* ignore cache errors */ });
                    return networkResponse;
                })
                .catch(() => cachedResponse || Response.error());

            return cachedResponse || fetchPromise;
        })
    );
});
