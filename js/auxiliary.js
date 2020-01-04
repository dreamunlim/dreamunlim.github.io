'use strict'

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// to yield positive mod on negative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}

// if window width < window height, i assume smartphone screen
// and need to resize canvas and objects
function resize() {
    var scale = 1;

    if (window.innerWidth < window.innerHeight) {
        scale = window.innerWidth / width;

        width = canvas.width = canvas.width * scale;
        height = canvas.height = canvas.height * scale;
        ctx.scale(scale, scale);
        ctx.save();
    }

    return scale;
}

function insertionSort(array) {
    for (var i = 1; i < array.length; ++i) {
        // insert part
        var j = i - 1; // rightIndex
        var value = array[i];

        while (j >= 0 && array[j] > value) {
            array[j + 1] = array[j];
            --j;
        }

        array[j + 1] = value;
    }
}
