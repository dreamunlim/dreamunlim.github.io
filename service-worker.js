'use strict'

const cacheName = "cache-v1";
const filesToCache = [
    "/",
    "index.html",
    "manifest.json",
    "css/style.css",
    "font/BebasNeue-Regular.woff2",
    "font/Orbitron-SemiBold.woff2",
    // "img/favicon.png", // noncrucial for offline
    "img/icon-192x192.png",
    "img/icon-512x512.png",
    "img/background-image.png",
    "img/enemy-red.png",
    "img/hi.png",
    "img/player-catto.png",
    "img/booster.png",
    "img/enemy-spider.png",
    "img/player-doggo.png",
    "img/enemy-star.png",
    "img/player-penetrator.png",
    "img/enemy-diamond.png",
    "img/menu-background.jpg",
    "img/player-tiny-ranger.png",
    "img/enemy-purple.png",
    // "img/fb-share-2.jpg", // noncrucial for offline
    "img/play-background.jpg",
    "js/auxiliary.js",
    "js/enemy.js",
    "js/level.js",
    "js/playState.js",
    "js/background.js",
    "js/gameObject.js",
    "js/levelParser.js",
    "js/shareScore.js",
    "js/booster.js",
    "js/gameObjectFactory.js",
    "js/loadingState.js",
    "js/soundManager.js",
    "js/button.js",
    "js/gameoverState.js",
    "js/main.js",
    "js/spider.js",
    "js/characterSelector.js",
    "js/gameState.js",
    "js/menuState.js",
    "js/star.js",
    "js/characterUnlocker.js",
    "js/gameStateMachine.js",
    "js/overridePicture.js",
    "js/textBox.js",
    "js/collisionManager.js",
    "js/heart.js",
    "js/pauseState.js",
    "js/textureManager.js",
    "js/counter.js",
    "js/playBackground.js",
    "js/vector2D.js",
    "js/diamond.js",
    "js/inputHandler.js",
    "js/player.js",
    "json/initAll.json",
    "sound/player-booster.ogg",
    "sound/player-diamond.ogg",
    "sound/player-heart.ogg",
    "sound/player-spider.ogg",
    "sound/player-star.ogg"
  ];

self.addEventListener("install", (event) => {
    console.log("SW installation");
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
        matchOptions = {ignoreSearch: true};
    }

    event.respondWith(
        caches.match(event.request, matchOptions)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );
});