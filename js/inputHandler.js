'use strict'
// had to make these global since after listener events get added,
// listeners temporarily modify the vars below (or they do modify
// but their own copy of the vars) unless I explicitly
// tell the listeners to access vars like "InputHandler.leftPressed"
      
// var leftPressed = false;
// var rightPressed = false;
// var upPressed = false;
// var downPressed = false;

class InputHandler {
    constructor() {
        this.leftPressed = false;
        this.rightPressed = false;
        this.upPressed = false;
        this.downPressed = false;
        
        this.escPressed = false;

        this.mouseLeftPressed = false;
    }

    keyDownHandler(e) {
        switch (e.key) {
            case "ArrowLeft":
                InputHandler.leftPressed = true;
                break;
            case "ArrowRight":
                InputHandler.rightPressed = true;
                break;
            case "ArrowUp":
                InputHandler.upPressed = true;
                break;
            case "ArrowDown":
                InputHandler.downPressed = true;
                break;
            case "Escape":
                InputHandler.escPressed = true;
                break;
        }
    }

    keyUpHandler(e) {
        switch (e.key) {
            case "ArrowLeft":
                InputHandler.leftPressed = false;
                break;
            case "ArrowRight":
                InputHandler.rightPressed = false;
                break;
            case "ArrowUp":
                InputHandler.upPressed = false;
                break;
            case "ArrowDown":
                InputHandler.downPressed = false;
                break;
            case "Escape":
                InputHandler.escPressed = false;
                break;
        }
    }

    mouseDownHandler(e) {
        switch (e.button) {
            case 0: // 0/1/2 - left/middle/right button
                InputHandler.mouseLeftPressed = true;

                var to = new Vector2D(e.offsetX, e.offsetY);
                player.position = to;
        }
    }

    mouseUpHandler(e) {
        switch (e.button) {
            case 0:
                InputHandler.mouseLeftPressed = false;
        }
    }
    
}