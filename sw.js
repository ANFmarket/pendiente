const CACHE_NAME = "pendiente-v2";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARCHIVOS))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(respuesta => {
                return respuesta || fetch(event.request);
            })
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        }).then(ventanas => {

            if (ventanas.length > 0) {
                return ventanas[0].focus();
            }

            return clients.openWindow("./");
        })
    );
});