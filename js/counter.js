import { random, drawText } from "./auxiliary.js";
import { frameStartTime } from "./main.js";
import { canvasInitialWidth } from "./canvas.js";
import { textureManager } from "./textureManager.js";
import { gameStateMachine } from "./gameStateMachine.js";

class Counter {
    constructor (initData) {
        // counter owner
        this.state = gameStateMachine.stack[gameStateMachine.stack.length - 1];

        this.counterID = initData.counterID;
        this.font = initData.font;
        this.fontColour = initData.fontColour;
        this.fontShadowColour = initData.fontShadowColour;

        if(initData.fontShadow != null) {
            this.fontShadow = initData.fontShadow;
        }

        // object specific variables
        if (this.counterID == "score") {
            this.state.scoreObject = this;

            this.score = 0;
            this.zeroesToShow = 3;
            this.formattedScore = "";
        }
        else if (this.counterID == "timer") {
            this.state.timerObject = this;

            this.timerResetValue = 10; // in sec
            this.actionStartTime = frameStartTime;
            this.totalTimePassed = 0; // in ms
            this.boosterPickUpTime = frameStartTime;
            this.timerCurrentValue = 0;
            this.formattedTimer = "";
        }
        else if (this.counterID == "lives") {
            // watermelon icon
            this.textureID = "watermelon";
            this.sWidth = 200;
            this.sHeight = 148;
            this.dWidth = 43;
            this.dHeight = 32;
            this.currentFrame = 0;
            this.currentRow = 0;
        }
        else if (this.counterID == "multiplier") {
            this.state.pointsMultiplier = this;

            this.active = false;
            this.duration = 0; // in ms
            this.activeMultiplier = 1;

            this.activate = () => {
                this.active = true;
                this.duration = random(3, 5) * 1000;
                this.activeMultiplier = random(3, 7);
            }
        }

        this.updateMap = {
            "score": this.updateScore,
            "timer": this.updateTimer,
            "lives": this.updateLives,
            "multiplier": this.updateMultiplier
        }

        this.drawMap = {
            "score": this.drawScore,
            "timer": this.drawTimer,
            "lives": this.drawLives,
            "multiplier": this.drawMultiplier
        }
    }

    updateObject() {
        this.updateMap[this.counterID](this);
    }

    drawObject() {
        this.drawMap[this.counterID](this);
    }

    updateScore(that) {
        var zeroesPresent = Math.floor(Math.log10(that.score));
        var zeroesToAdd = that.zeroesToShow - zeroesPresent;
        
        if (that.score == 0) {
            that.formattedScore = "0000";
            return;
        }

        if (zeroesToAdd > 0) {
            var str = "";
            var i = 0;
            while (i != zeroesToAdd) {
                str += "0";
                ++i;
            }
            that.formattedScore = str + that.score;
        }
        else {
            that.formattedScore = that.score;
        }
    }

    updateTimer(that) {
        that.totalTimePassed = frameStartTime - that.actionStartTime;
        that.timerCurrentValue = that.timerResetValue - Math.floor((frameStartTime - that.boosterPickUpTime) / 1000);

        // format number
        if (that.timerCurrentValue < 10) {
            that.formattedTimer = "0" + that.timerCurrentValue;
        } else {
            that.formattedTimer = that.timerCurrentValue;
        }

        // switch state
        if (that.timerCurrentValue <= 0) {
            that.formattedTimer = "00";
            
            // wait for booster to fall offscreen
            if (! that.state.boosterObject.spawned) {
                that.state.switchToGameOverState();
            }
        }
    }

    updateLives(that) {

    }

    updateMultiplier(that) {
        if ((frameStartTime - that.state.timerObject.boosterPickUpTime) > that.duration) {
            that.active = false;
            that.activeMultiplier = 1;
        }
    }

    drawScore(that) {
        var x = 0;
        var y = 0;
        drawText(that.formattedScore, x + 2, y + 2, that.font, "start", that.fontShadowColour);
        drawText(that.formattedScore, x, y, that.font, "start", that.fontColour);
    }

    drawTimer(that) {
        var x = canvasInitialWidth / 2;
        var y = 0;
        drawText(that.formattedTimer, x, y - 1, that.fontShadow, "center", that.fontShadowColour);
        drawText(that.formattedTimer, x, y, that.font, "center", that.fontColour);
    }

    drawLives(that) {
        var x = 150;
        var y = 0;
        textureManager.drawTexture(that.textureID, that.currentFrame, that.currentRow,
            that.sWidth, that.sHeight, x, y + 2, that.dWidth, that.dHeight);
        
        drawText(that.state.playerObject.lives, x + 38, y + 2, that.font, "start", that.fontShadowColour);
        drawText(that.state.playerObject.lives, x + 38, y, that.font, "start", that.fontColour);
    }

    drawMultiplier(that) {
        if (that.active) {
            let x = 319;
            let y = 0;
            drawText("x" + that.activeMultiplier, x + 2, y + 2, that.font, "center", that.fontShadowColour);
            drawText("x" + that.activeMultiplier, x, y, that.font, "center", that.fontColour);
        }
    }
}

export { Counter };