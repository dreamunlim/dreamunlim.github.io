import { GameState } from "./gameState.js";
import { canvasInitialHeight, canvasInitialWidth, clearCanvas } from "./canvas.js";
import { drawText } from "./auxiliary.js";
import { gameStateMachine } from "./gameStateMachine.js";

class UpdatingState extends GameState {
    constructor() {
        super();

        this.text = "Updating";
        this.textFont = "68px Bebas Neue";
        this.fontShadowColour = "#009091"; // dark green
        this.fontColour = "seashell";

        this.drawnOnce = false;
    }

    update() {
    }

    draw() {
        if (! this.drawnOnce) {
            let x = canvasInitialWidth / 2;
            let y = canvasInitialHeight / 2;
            clearCanvas(0, 0, canvasInitialWidth, canvasInitialHeight, "rgba(3,149,149, 0.5)");
            drawText(this.text, x + 2, y + 2, this.textFont, "center", this.fontShadowColour, "middle");
            drawText(this.text, x, y, this.textFont, "center", this.fontColour, "middle");

            this.drawnOnce = true;
        }
    }

    onEnter() {
        try {
            window.location.reload(); // reload with updated files
        } catch (error) {
            this.popUpdatingState();
        }

        return true;
    }

    onExit() {
        this.clean();

        return true;
    }

    clean() {
        // delete old object layers
        this.level.layers = new Array();

        // reset
        this.drawnOnce = false;
    }

    //call back functions
    popUpdatingState() {
        gameStateMachine.requestStackPop();
    }
}

export { UpdatingState };