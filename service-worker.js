'use strict'

// 30.10.2024

const cacheName = "cache-v1";
const filesToCache = [
    "/",
    "index.html",
    "manifest.json",
    "css/style.css",
    "font/BebasNeue-Regular.woff2",
    "font/Coiny-Regular.woff2",
    "font/Orbitron-SemiBold.woff2",
    "img/background-image.png",
    "img/booster.png",
    "img/enemy-diamond-1.png",
    "img/enemy-diamond-2.png",
    "img/enemy-purple.png",
    "img/enemy-red.png",
    "img/enemy-spider.png",
    "img/enemy-star.png",
    "img/favicon.png",
    // "img/fb-share-4.jpg", // noncrucial for offline
    "img/hi.png",
    "img/icon-192x192.png",
    "img/icon-512x512.png",
    "img/menu-background.jpg",
    "img/play-background-1.jpg",
    "img/play-background-2.jpg",
    "img/play-background-3.jpg",
    "img/player-catto.png",
    "img/player-doggo.png",
    "img/player-penetrator.png",
    "img/player-tiny-ranger.png",
    "img/watermelon.png",
    "js/auxiliary.js",
    "js/background.js",
    "js/booster.js",
    "js/button.js",
    "js/canvas.js",
    "js/characterSelector.js",
    "js/characterUnlocker.js",
    "js/collisionManager.js",
    "js/counter.js",
    "js/diamond.js",
    "js/enemy.js",
    "js/eventHandlers.js",
    "js/gameObject.js",
    "js/gameObjectFactory.js",
    "js/gameoverState.js",
    "js/gameState.js",
    "js/gameStateMachine.js",
    "js/heart.js",
    "js/info.js",
    "js/inputHandler.js",
    "js/level.js",
    "js/levelParser.js",
    "js/loadingState.js",
    "js/main.js",
    "js/menuState.js",
    "js/overridePicture.js",
    "js/pauseState.js",
    "js/playBackground.js",
    "js/player.js",
    "js/playState.js",
    "js/pointsMultiplier.js",
    "js/shareScore.js",
    "js/soundManager.js",
    "js/spider.js",
    "js/star.js",
    "js/textBox.js",
    "js/textureManager.js",
    "js/updatingState.js",
    "js/vector2D.js",
    "js/watermelon.js",
    "json/initAll.json",
    "sound/player-booster.mp3",
    "sound/player-diamond.mp3",
    "sound/player-heart.mp3",
    "sound/player-spider.mp3",
    "sound/player-star.mp3"
];

self.addEventListener("install", (event) => {
    console.log("SW installation");

    self.skipWaiting(); // activate worker right after installation

    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener("activate", (event) => {
    console.log("SW activation");
});

self.addEventListener("fetch", (event) => {
    // console.log("Fetch intercepted for: ", event.request.url);

    var matchOptions = {};

    // ignore the "?from=homescreen" query parameter from navigation request
    // to get the SW cache match for "index.html"
    if (event.request.mode === "navigate") {
        matchOptions = { ignoreSearch: true };
    }

    event.respondWith(
        caches.match(event.request, matchOptions)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );
});