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

// Disable custom fetch handling to avoid clone/body errors and stale code issues.
// The app will just use the network (and the browser's default HTTP cache).
self.addEventListener("fetch", () => {
    // Intentionally empty.
});
