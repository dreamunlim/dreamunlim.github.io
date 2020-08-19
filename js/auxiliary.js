'use strict'

function parseJson(jsonPath) {

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
    var scale = 1;

    if (window.innerWidth < window.innerHeight) {
        scale = window.innerWidth / width;
    } else {
        scale = window.innerHeight / height;
    }

    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    return scale;
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
    scale = resizeCanvas();

    // redraw PlayState once, since canvas data is reset on resizing
    var state = gameStateMachine.stack[gameStateMachine.stack.length - 1];

    if (state instanceof PauseState || state instanceof GameoverState) {
        state.playState.draw();
    }
}

function onStorageChange() {
    if (localStorage.length) {
        var menuState = gameStateMachine.stack[0];
        var storage = JSON.parse(localStorage.getItem("data"));
        
        menuState.topScore = storage.score;
        menuState.characterSelector.charPointer = storage.selectedChar;
        menuState.characterSelector.updatePlayerInitData();
        menuState.shareScoreObj.dataToShare = storage.fbShareData;
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