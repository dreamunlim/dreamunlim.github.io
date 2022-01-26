const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// canvas dimensions before resize
// crucial to keep to get proper player-enemy collision
// since enemy y position was automatically rescaled
// if collision was checked against canvas resized height
const canvasInitialWidth = 896;
const canvasInitialHeight = 640;

let canvasScaler = 1;

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

function clearCanvas(x = 0, y = 0, width = canvas.width, height = canvas.height, colour = "rgba(0, 0, 0, 1)") {
    ctx.fillStyle = colour; // 0.5 to create trail effect
    ctx.fillRect(x, y, width, height);
}

export {
    canvas, ctx, canvasInitialHeight, canvasInitialWidth, canvasScaler, resizeCanvas,
    clearCanvas
};