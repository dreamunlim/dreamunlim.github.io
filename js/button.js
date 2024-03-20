import { ctx } from "./canvas.js";
import { frameStartTime } from "./main.js";
import { drawText, drawRoundRectangle } from "./auxiliary.js";
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
        this.highlight = false;

        this.setButtonStyle();

        // keep initial dimensions to restore
        this.initial = {
            position: {x: this.position.x, y: this.position.y},
            width: this.width,
            height: this.height,
        }

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
                this.highlightStrokeWidth = 4;
                this.highlightStrokeColour = "lightsalmon";
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
                this.highlightStrokeColour = "brown";
                break;
        }
        this.cornerRadius = 12;
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

    handleClick() {
        this.t1 = frameStartTime;
        this.resolveCallback = true;

        // shrink button
        let shiftX = this.width * 0.04;
        let shiftY = this.height * 0.05;
        this.width = this.width - shiftX * 2;
        this.height = this.height - shiftY * 2;
        this.position.x += shiftX;
        this.position.y += shiftY;
    }

    updateObject() {
        this.deactivateButton();

        // reset dimensions
        if ((frameStartTime - this.t1) > this.resetDelay) {
            this.position.x = this.initial.position.x;
            this.position.y = this.initial.position.y;
            this.width = this.initial.width;
            this.height = this.initial.height;
        }

        // resolve callback
        if (this.resolveCallback && ((frameStartTime - this.t1) > this.callbackDelay)) {
            this.state.funcPointersMap[this.text](this);
            this.resolveCallback = false;
        }

        // mouse
        if (inputHandler.mouseLeftPressed) {
            if (collisionManager.mouseButtonCollision(inputHandler.mEvent, this)) {
                this.handleClick();
                inputHandler.mouseLeftPressed = false;
            }
        }
    }

    drawObject() {
        // shortened aliases
        const [x, y, width, height] = [this.position.x, this.position.y, this.width, this.height];
        
        drawRoundRectangle(x, y, width, height, this.strokeWidth, this.strokeColour, this.fillColour, this.cornerRadius);
        drawText(this.text, x + 2 + width/2, y + 2 + height/2, this.titleFont, "center", this.fontShadowColour, "middle", width);
        drawText(this.text, x + width/2, y + height/2, this.titleFont, "center", this.fontColour, "middle", width);

        this.showHintMessage(x, y, width, height);
        this.shadeButton(x, y, width, height);
        this.highlightButton(x, y, width, height, this.cornerRadius);
    }

    setHintMessage(hintMessage) {
        this.t1 = frameStartTime;
        this.hintMessage = hintMessage;
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
                    this.shadeColour = "rgba(255,192,203, 0.6)"; //pink
                    break;
            }

            drawRoundRectangle(x, y, width, height, this.strokeWidth, this.shadeColour, this.shadeColour, this.cornerRadius);
        }
    }

    doPlainHighlight() {
        this.highlight = true;
    }

    removeHighlight() {
        this.highlight = false;
    }

    doAnimatedHighlight() {
        this.t1 = frameStartTime;
        this.highlight = true;

        // pop out button
        let shiftX = this.width * 0.04;
        let shiftY = this.height * 0.05;
        this.width = this.width + shiftX * 2;
        this.height = this.height + shiftY * 2;
        this.position.x -= shiftX;
        this.position.y -= shiftY;
    }
    
    highlightButton(x, y, width, height, cornerRadius) {
        if (this.highlight) {
            switch (this.state.constructor.name) {
                case "MenuState":
                    x -= 1;
                    y -= 1;
                    width += 2;
                    height += 2;
                    break;
            }

            ctx.lineWidth = this.highlightStrokeWidth || this.strokeWidth;
            ctx.strokeStyle = this.highlightStrokeColour;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, cornerRadius);
            ctx.stroke();
        }
    }
}

export { Button };