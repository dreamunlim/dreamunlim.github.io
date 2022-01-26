import { Enemy } from "./enemy.js";
import { random } from "./auxiliary.js";
import { frameStartTime } from "./main.js";
import { soundManager } from "./soundManager.js";

class Heart extends Enemy {
    constructor () {
        super();

        this.pointsToAdd = 1;

        this.t1 = 0;
        this.t2 = 0;
        this.beatPattern = [1, .97, .93, .9, .93, .97, 1, 1.03];
        this.currStep = random(0, this.beatPattern.length - 1);
    }

    initObject(initData) {
        super.initObject(initData);

        this.initialWidth = this.dWidth;
        this.initialHeight = this.dHeight;
    }

    updateObject() {
        super.updateObject();

        this.t2 = Math.floor(frameStartTime / this.animSpeed);

        // do beat step
        if (this.t1 < this.t2) {
            // prevent shrinking
            this.dWidth = this.initialWidth;
            this.dHeight = this.initialHeight;

            this.dWidth = this.beatPattern[this.currStep] * this.dWidth;
            this.dHeight = this.beatPattern[this.currStep] * this.dHeight;

            this.currStep = (++this.currStep) % this.beatPattern.length;

            this.t1 = this.t2;
        }
    }

    drawObject() {
        super.drawObject();
    }

    respondToCollision() {
        this.state.scoreObject.score += this.pointsToAdd;
        this.respawnAfterDraw = true;
        soundManager.playSound(this.enemyID);
    }
}

export { Heart };