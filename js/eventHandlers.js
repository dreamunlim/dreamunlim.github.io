import { canvas, resizeCanvas } from "./canvas.js";
import { onVisibilityChange, onResize, onStorageChange } from "./auxiliary.js";
import { inputHandler } from "./inputHandler.js";

document.addEventListener("keydown", inputHandler.keyDownHandler, false);
document.addEventListener("keyup", inputHandler.keyUpHandler, false);
canvas.addEventListener("pointerdown", inputHandler.mouseDownHandler, false);
document.addEventListener("pointerdown", inputHandler.documentMouseDownHandler, false);
// document.addEventListener("pointerup", inputHandler.mouseUpHandler, false);
document.addEventListener("visibilitychange", onVisibilityChange, false);
window.addEventListener('resize', onResize, false);
window.addEventListener('storage', onStorageChange, false);
window.addEventListener('DOMContentLoaded', resizeCanvas, false);