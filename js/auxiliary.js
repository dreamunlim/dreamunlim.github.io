'use strict'

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
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