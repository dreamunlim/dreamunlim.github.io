class InputHandler {
    constructor() {
        this.leftPressed = false;
        this.rightPressed = false;
        this.upPressed = false;
        this.downPressed = false;

        this.escPressed = false;

        this.mouseLeftPressed = false;
        this.mEvent; // bookkeep mouse event 
    }

    keyDownHandler(e) {
        switch (e.key) {
            case "ArrowLeft":
                inputHandler.leftPressed = true;
                break;
            case "ArrowRight":
                inputHandler.rightPressed = true;
                break;
            case "ArrowUp":
                inputHandler.upPressed = true;
                break;
            case "ArrowDown":
                inputHandler.downPressed = true;
                break;
            case "Escape":
                inputHandler.escPressed = true;
                break;
        }
    }

    keyUpHandler(e) {
        switch (e.key) {
            case "ArrowLeft":
                inputHandler.leftPressed = false;
                break;
            case "ArrowRight":
                inputHandler.rightPressed = false;
                break;
            case "ArrowUp":
                inputHandler.upPressed = false;
                break;
            case "ArrowDown":
                inputHandler.downPressed = false;
                break;
            case "Escape":
                inputHandler.escPressed = false;
                break;
        }
    }

    mouseDownHandler(e) {
        switch (e.button) {
            case 0: // 0/1/2 - left/middle/right button
                inputHandler.mouseLeftPressed = true;
                inputHandler.mEvent = e;
        }
    }

    mouseUpHandler(e) {
        switch (e.button) {
            case 0:
                // 'pointerup' event triggers too fast on mobile
                // 'mouseLeftPressed' is mostly 'false' when 'player'
                // gets to update itself
                // inputHandler.mouseLeftPressed = false;
        }
    }
}

const inputHandler = new InputHandler();

export { inputHandler };