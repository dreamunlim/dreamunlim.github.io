import { smartTV } from "./auxiliary.js";

class InputHandler {
    constructor() {
        // host device identifier
        this.smartTV = smartTV();

        this.leftPressed = false;
        this.rightPressed = false;
        this.upPressed = false;
        this.downPressed = false;
        this.escPressed = false;
        this.enterPressed = false;
        this.keyEvent; // bookkeep keyboard event

        this.mouseLeftPressed = false;
        this.mEvent; // bookkeep mouse event
    }

    keyDownHandler(e) {
        inputHandler.keyEvent = e;

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
            case "Enter":
                inputHandler.enterPressed = true;
                break;
            case "Escape":
                inputHandler.escPressed = true;
                break;
        }

        // used on some TV's
        if (this.smartTV) {
            switch (e.keyCode) {
                case "VK_LEFT":
                    inputHandler.leftPressed = true;
                    break;
                case "VK_RIGHT":
                    inputHandler.rightPressed = true;
                    break;
                case "VK_UP":
                    inputHandler.upPressed = true;
                    break;
                case "VK_DOWN":
                    inputHandler.downPressed = true;
                    break;
                case "VK_ENTER":
                    inputHandler.enterPressed = true;
                    break;
            }
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
            case "Enter":
                inputHandler.enterPressed = false;
                break;
            case "Escape":
                inputHandler.escPressed = false;
                break;
        }

        // used on some TV's 
        if (this.smartTV) {
            switch (e.keyCode) {
                case "VK_LEFT":
                    inputHandler.leftPressed = false;
                    break;
                case "VK_RIGHT":
                    inputHandler.rightPressed = false;
                    break;
                case "VK_UP":
                    inputHandler.upPressed = false;
                    break;
                case "VK_DOWN":
                    inputHandler.downPressed = false;
                    break;
                case "VK_ENTER":
                    inputHandler.enterPressed = false;
                    break;
            }
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