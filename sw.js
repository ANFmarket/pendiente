const CACHE_NAME = "pendiente-v3";

const ARCHIVOS = [
    "./manifest.json",
    "./icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARCHIVOS))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(nombres => {
            return Promise.all(
                nombres
                    .filter(nombre => nombre !== CACHE_NAME)
                    .map(nombre => caches.delete(nombre))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {

    if (event.request.mode === "navigate") {
        event.respondWith(
            fetch(event.request).catch(() =>
                caches.match("./index.html")
            )
        );
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(respuesta => respuesta || fetch(event.request))
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