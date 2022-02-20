import { drawText } from "./auxiliary.js";
import { frameStartTime } from "./main.js";
import { ctx, clearCanvas } from "./canvas.js";
import { inputHandler } from "./inputHandler.js";
import { collisionManager } from "./collisionManager.js";
import { gameStateMachine } from "./gameStateMachine.js";

class Button {
    constructor (initData) {
        // button owner
        this.state = gameStateMachine.stack[gameStateMachine.stack.length - 1];

        this.text = initData.text;
        this.position = initData.pos;
        this.width = initData.width;
        this.height = initData.height;

        if(initData.url != null) {
            this.url = initData.url;
        }

        this.t1 = 0;
        this.resetDelay = 50; // in ms
        this.callbackDelay = 65; // in ms
        this.resolveCallback = false;
        this.hintDelay = 2000;

        // keep initial dimensions to restore
        this.initial = {
            position: {x: this.position.x, y: this.position.y},
            width: this.width,
            height: this.height,
        }

        this.setButtonStyle();

        // state specific adjustments
        switch (this.state.constructor.name) {
            case "PlayState":
                this.state.pauseButton = this; // make visible to Player, PauseState
                this.callbackDelay = 0;
                break;
            case "GameoverState":
                this.state.textBox.alignButton(this);
                break;
        }
    }

    setButtonStyle() {
        switch (this.state.constructor.name) {
            case "MenuState":
                this.titleFont = "55px Bebas Neue";
                this.strokeWidth = 3;
                this.strokeColour = "maroon";
                this.fillColour ="rgba(165,42,42, 0.8)"; //brown
                this.fontShadowColour = this.strokeColour;
                this.fontColour = "lightsalmon";
                break;
            case "PlayState":
                this.titleFont = "55px Bebas Neue";
                this.strokeWidth = 5;
                this.strokeColour = "indianred";
                this.fillColour ="rgba(165,42,42, 0.3)"; //brown
                this.fontShadowColour = "brown";
                this.fontColour = "indianred";
                break;
            case "GameoverState":
                this.titleFont = "55px Bebas Neue";
                this.strokeWidth = 5;
                this.strokeColour = "indianred";
                this.fillColour ="rgba(255,192,203, 0.3)"; //pink
                this.fontShadowColour = "brown";
                this.fontColour = "indianred";
                break;
        }
    }

    deactivateButton() {
        switch (this.text) {
            case "Revive":
                if (this.state.playState.timerObject.timerCurrentValue <= 0 ||
                    this.state.playState.playerObject.lives == 0) {
                    this.resolveCallback = false;
                    this.inactive = true;
                }
                break;
        }
    }

    updateObject() {
        this.deactivateButton();

        // reset dimensions
        if((frameStartTime - this.t1) > this.resetDelay) {
            this.position.x = this.initial.position.x;
            this.position.y = this.initial.position.y;
            this.width = this.initial.width;
            this.height = this.initial.height;
        }

        // resolve callback
        if(this.resolveCallback && ((frameStartTime - this.t1) > this.callbackDelay)) {
            this.state.funcPointersMap[this.text](this);
            this.resolveCallback = false;
        }

        // mouse
        if(inputHandler.mouseLeftPressed) {
            if (collisionManager.mouseButtonCollision(inputHandler.mEvent, this)) {
                this.t1 = frameStartTime;
    
                var shiftX = this.width * 0.04;
                var shiftY = this.height * 0.05;
                this.width = this.width - shiftX * 2;
                this.height = this.height - shiftY * 2;
                this.position.x += shiftX;
                this.position.y += shiftY;

                this.resolveCallback = true;
                
                inputHandler.mouseLeftPressed = false;
            }
        }
    }

    drawObject() {
        this.drawButton(this.position.x, this.position.y, this.width, this.height);
    }

    drawButton(x, y, width, height) {
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColour;
        ctx.strokeRect(x, y, width, height);
        clearCanvas(x, y, width, height, this.fillColour);
        drawText(this.text, x + 2 + width/2, y + 2 + height/2, this.titleFont, "center", this.fontShadowColour, "middle", width);
        drawText(this.text, x + width/2, y + height/2, this.titleFont, "center", this.fontColour, "middle", width);

        this.showHintMessage(x, y, width, height);
        this.shadeButton(x, y, width, height);
    }

    showHintMessage(x, y, width, height) {
        if (this.hintMessage) {
            drawText(this.hintMessage, x + width / 2, y + height,
                "30px Bebas Neue", "center", "seashell", "bottom", width);

            // remove hint
            if ((frameStartTime - this.t1) > this.hintDelay) {
                delete this.hintMessage;
            }
        }
    }

    shadeButton(x, y, width, height) {
        if (this.inactive) {
            switch (this.text) {
                case "Revive":
                    this.shadeColour = ctx.strokeStyle = "rgba(255,192,203, 0.6)"; //pink
                    break;
            }
            ctx.strokeRect(x, y, width, height);
            clearCanvas(x, y, width, height, this.shadeColour);
        }
    }

}

export { Button };