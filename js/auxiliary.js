'use strict'

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// considering on 640x640 window box, objects look big enough on 11.6 inch FHD screen  
// if window width < window height, i assume smartphone screen
// and need to resize canvas and objects
function resize() {
    var scale = window.innerWidth / width;

    if (window.innerWidth < window.innerHeight) {
        width = canvas.width = canvas.width * scale;
        height = canvas.height = canvas.height * scale;
        ctx.scale(scale, scale);
    }

    return scale;
}