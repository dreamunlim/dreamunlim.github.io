'use strict'

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