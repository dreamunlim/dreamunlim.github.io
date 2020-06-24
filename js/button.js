'use strict'

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
                this.state.textBox.alignOkButton(this);
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

    updateObject() {
        // reset dimensions
        if((time - this.t1) > this.resetDelay) {
            this.position.x = this.initial.position.x;
            this.position.y = this.initial.position.y;
            this.width = this.initial.width;
            this.height = this.initial.height;
        }

        // resolve callback
        if(this.resolveCallback && ((time - this.t1) > this.callbackDelay)) {
            this.state.funcPointersMap[this.text](this);
            this.resolveCallback = false;
        }

        // mouse
        if(inputHandler.mouseLeftPressed) {
            if (collisionManager.mouseButtonCollision(inputHandler.mEvent, this)) {
                this.t1 = time;
    
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

        if(this.hintMessage) {
            drawText(this.hintMessage, this.position.x + this.width/2, this.position.y + this.height,
                "30px Bebas Neue", "center", "seashell", "bottom", this.width);

            // remove hint
            if ((time - this.t1) > this.hintDelay) {
                delete this.hintMessage;
            }
        }
    }

    drawButton(x, y, width, height) {
        ctx.lineWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeColour;
        ctx.strokeRect(x, y, width, height);
        clearCanvas(x, y, width, height, this.fillColour);
        drawText(this.text, x + 2 + width/2, y + 2 + height/2, this.titleFont, "center", this.fontShadowColour, "middle", width);
        drawText(this.text, x + width/2, y + height/2, this.titleFont, "center", this.fontColour, "middle", width);
    }

}