const CACHE = "clinical5-20261103-v2";
const CORE = [
  "./",
  "./index.html",
  "./assets/styles.css?v=20261022",
  "./assets/icon.svg?v=20261022",
  "./src/scoring.js?v=20261022",
  "./src/app.js?v=20261022",
  "./data/score-spec.json?v=20261022",
  "./manifest.webmanifest?v=20261022"
];

const NETWORK_FIRST_DESTINATIONS = new Set(["document", "script", "style"]);

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const networkFirst = event.request.mode === "navigate" ||
    NETWORK_FIRST_DESTINATIONS.has(event.request.destination) ||
    url.pathname.endsWith(".json") || url.pathname.endsWith(".webmanifest");

  if (networkFirst) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const request = new Request(event.request, { cache: "reload" });
        const response = await fetch(request);
        if (response.ok) await cache.put(event.request, response.clone());
        return response;
      } catch {
        return (await cache.match(event.request)) ||
          (event.request.mode === "navigate" ? await cache.match("./index.html") : Response.error());
      }
    })());
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  })));
});
