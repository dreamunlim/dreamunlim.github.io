import { Info } from "./info.js";
import { drawText } from "./auxiliary.js";
import { frameStartTime } from "./main.js";
import { textureManager } from "./textureManager.js";

class Counter extends Info {
    constructor (initData) {
        super(initData);

        this.counterID = initData.counterID;

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

        this.updateMap = {
            "score": this.updateScore,
            "timer": this.updateTimer,
            "lives": this.updateLives
        }

        this.drawMap = {
            "score": this.drawScore,
            "timer": this.drawTimer,
            "lives": this.drawLives
        }
    }

    updateObject() {
        this.updateMap[this.counterID](this);
    }

    drawObject() {
        this.drawMap[this.counterID](this);
    }

    updateScore(that) {
        let zeroesPresent = Math.floor(Math.log10(that.score));
        let zeroesToAdd = that.zeroesToShow - zeroesPresent;
        
        if (that.score == 0) {
            that.formattedScore = "0000";
            return;
        }

        if (zeroesToAdd > 0) {
            let str = "";
            let i = 0;
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

    drawScore(that) {
        drawText(that.formattedScore, that.position.x + 2, that.position.y + 2, that.font, "start", that.fontShadowColour);
        drawText(that.formattedScore, that.position.x, that.position.y, that.font, "start", that.fontColour);
    }

    drawTimer(that) {
        drawText(that.formattedTimer, that.position.x, that.position.y - 1, that.fontShadow, "center", that.fontShadowColour);
        drawText(that.formattedTimer, that.position.x, that.position.y, that.font, "center", that.fontColour);
    }

    drawLives(that) {
        textureManager.drawTexture(that.textureID, that.currentFrame, that.currentRow,
            that.sWidth, that.sHeight, that.position.x, that.position.y + 2, that.dWidth, that.dHeight);
        
        drawText(that.state.playerObject.lives, that.position.x + 38, that.position.y + 2, that.font, "start", that.fontShadowColour);
        drawText(that.state.playerObject.lives, that.position.x + 38, that.position.y, that.font, "start", that.fontColour);
    }
}

export { Counter };