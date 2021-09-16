'use strict'

function parseGameJson(jsonPath) {

    fetch(jsonPath)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            gameJson = json;
        })
        .then(() => {
            setInterval(loop, FRAME_TIME);
        })
        .catch(function (error) {
            console.error(error);
        });

    // var request = new XMLHttpRequest();

    // request.open('GET', jsonPath);
    // request.responseType = 'json';
    // request.send();

    // request.onload = function () {
    //     gameJson = request.response;
    // }
}

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// to yield positive mod on negative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}

// fit canvas to the shortest screen side
function resizeCanvas() {
    if (window.innerWidth < window.innerHeight) {
        canvasScaler = window.innerWidth / canvasInitialWidth;
    } else {
        canvasScaler = window.innerHeight / canvasInitialHeight;
    }

    canvas.width = canvasInitialWidth * canvasScaler;
    canvas.height = canvasInitialHeight * canvasScaler;
    ctx.scale(canvasScaler, canvasScaler);
}

// sort in descending order
function insertionSort(array) {
    for (var i = 1; i < array.length; ++i) {
        // insert part
        var j = i - 1; // rightIndex
        var value = array[i];

        while (j >= 0 && array[j][0] < value[0]) {
            array[j + 1] = array[j];
            --j;
        }

        array[j + 1] = value;
    }
}

function drawText(text, x, y, font, align, colour, baseline = "top", width = canvas.width) {
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillStyle = colour;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y, width);
}

function clearCanvas(x = 0, y = 0, width = canvas.width, height = canvas.height, colour = "rgba(0, 0, 0, 1)") {
    ctx.fillStyle = colour; // 0.5 to create trail effect
    ctx.fillRect(x, y, width, height);
}

function onVisibilityChange() {
    if (document.visibilityState == "hidden") {
        var state = gameStateMachine.stack[gameStateMachine.stack.length - 1];

        if (state instanceof PlayState) {
            state.switchToPauseState();
        }
    }
}

function onResize() {
    // resize canvas always first to set global scaler
    resizeCanvas();

    // redraw PlayState once, since canvas data is reset on resizing
    var state = gameStateMachine.stack[gameStateMachine.stack.length - 1];

    if (state instanceof PauseState || state instanceof GameoverState) {
        state.playState.draw();
    }
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === "QuotaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function onStorageChange() {
    var menuState = gameStateMachine.stack[0];

    if (menuState.localStorageAvailable && localStorage.length) {
        var storage = JSON.parse(localStorage.getItem("data"));

        menuState.topScore = storage.topScore;
        menuState.shareScoreObj.dataToShare = storage.fbShareData;
        menuState.characterSelector.charPointer = storage.selectedChar;
        menuState.characterSelector.updatePlayerInitData();
        menuState.characterSelector.hiddenChars = storage.hiddenChars;
        menuState.characterUnlocker.charUnlocked = storage.charUnlocked;
        menuState.consentGranted = storage.consentGranted;
    }
}

function drawTriangle(p1, p2, p3) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
}

function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js")
            .then(registration => {
                console.log("SW registered: ", registration.scope);
            })
            .catch(error => {
                console.error("SW registration failed: ", error);
            });
    }
}