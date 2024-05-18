import { setGameJson, loop } from "./main.js";
import { ctx, canvasInitialWidth, resizeCanvas } from "./canvas.js";
import { inputHandler } from "./inputHandler.js";
import { gameStateMachine } from "./gameStateMachine.js";
import { PlayState } from "./playState.js";
import { PauseState } from "./pauseState.js";
import { GameoverState } from "./gameoverState.js";

async function parseGameJson(jsonPath) {
    try {
        const response = await fetch(jsonPath);
        const json = await response.json();
        setGameJson(json);
        requestAnimationFrame(loop);

    } catch (error) {
        console.error(error);
    }
}

function random(min, max, returnType = "integer") {
    if(returnType == "integer") {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    if(returnType == "float") {
        return Math.random() * (max - min) + min;
    }
}

// to yield positive mod on negative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}

// sort in descending order
function insertionSort(array) {
    for (var j = 1; j < array.length; ++j) {
        var value = array[j];

        var i = j - 1;
        while (i >= 0 && array[i][0] < value[0]) {
            array[i + 1] = array[i];
            --i;
        }

        array[i + 1] = value;
    }
}

function drawText(text, x, y, font, align, colour, baseline = "top", width = canvasInitialWidth) {
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillStyle = colour;
    ctx.textBaseline = baseline;
    ctx.fillText(text, x, y, width);
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
    let menuState = gameStateMachine.stack[0];

    if (menuState.localStorageAvailable && localStorage.length) {
        let storage = JSON.parse(localStorage.getItem("data"));

        menuState.topScore = storage.topScore;
        menuState.shareScoreObj.dataToShare = storage.fbShareData;
        menuState.characterSelector.charPointer = storage.selectedChar;
        menuState.characterSelector.updatePlayerInitData();
        menuState.characterSelector.hiddenChars = storage.hiddenChars;
        menuState.characterUnlocker.charUnlocked = storage.charUnlocked;
        menuState.consentGranted = storage.consentGranted;
        inputHandler.keyEvent = storage.keyboardUsed;
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

// add a roundRect() method to Canvas API for Chrome versions below 99
if (typeof CanvasRenderingContext2D.prototype.roundRect !== "function") {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radius) {
        if (w < 2 * radius) radius = w / 2;
        if (h < 2 * radius) radius = h / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + w, y, x + w, y + h, radius);
        this.arcTo(x + w, y + h, x, y + h, radius);
        this.arcTo(x, y + h, x, y, radius);
        this.arcTo(x, y, x + w, y, radius);
        this.closePath();
    }
}

function drawRoundRectangle(x, y, width, height, strokeWidth, strokeColour, fillColour, cornerRadius = 0, strokeThenFill = true) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColour;
    ctx.fillStyle = fillColour;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, cornerRadius);

    if (strokeThenFill) {
        ctx.stroke();
        ctx.fill();
    } else {
        ctx.fill();
        ctx.stroke();
    }
}

function smartTV() {
    let TV = /Smart|TV/i.test(navigator.userAgent);

    if (!TV) {
        const tvViewportWidths = [1280, 1920, 3840];
        const currentViewportWidth = window.innerWidth;
        TV = tvViewportWidths.includes(currentViewportWidth);
    }

    return TV;
}

function resizeViewport() {
    // double resolution in mobile browsers only, excluding TV ones
    if (! smartTV()) {
        const viewport = "meta[name=viewport]";
        const content = "width=device-width, initial-scale=0.5, user-scalable=no";
        document.querySelector(viewport).setAttribute("content", content);
    }
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

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            // fires when a new worker has skipped waiting and become the new active worker
            let menuState = gameStateMachine.stack[0];
            menuState.reloadGame = true;
        })
    }
}

export {
    parseGameJson, random, mod, insertionSort, drawText, onVisibilityChange,
    onResize, storageAvailable, onStorageChange, drawTriangle, drawRoundRectangle,
    smartTV, resizeViewport, registerServiceWorker
};