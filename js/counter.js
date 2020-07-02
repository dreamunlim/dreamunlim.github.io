'use strict'

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

        if (this.counterID == "timer") {
            this.state.timerObject = this;

            this.timerResetValue = 10; // in sec
            this.actionStartTime = time;
            this.totalTimePassed = 0; // in ms
            this.boosterPickUpTime = time;
            this.timerCurrentValue = 0;
            this.formattedTimer = "";
        }

        this.updateMap = {
            "score": this.updateScore,
            "timer": this.updateTimer
        }

        this.drawMap = {
            "score": this.drawScore,
            "timer": this.drawTimer            
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
        that.totalTimePassed = time - that.actionStartTime;
        that.timerCurrentValue = that.timerResetValue - Math.floor((time - that.boosterPickUpTime) / 1000);

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

    drawScore(that) {
        var x = 0;
        var y = 0;
        drawText(that.formattedScore, x + 2, y + 2, that.font, "start", that.fontShadowColour);
        drawText(that.formattedScore, x, y, that.font, "start", that.fontColour);
    }

    drawTimer(that) {
        var x = width / 2;
        var y = 0;
        drawText(that.formattedTimer, x, y - 1, that.fontShadow, "center", that.fontShadowColour);
        drawText(that.formattedTimer, x, y, that.font, "center", that.fontColour);
    }

}