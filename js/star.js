import { Enemy } from "./enemy.js";
import { random } from "./auxiliary.js";
import { frameStartTime } from "./main.js";
import { soundManager } from "./soundManager.js";

class Star extends Enemy {
    constructor () {
        super();

        this.pointsToAdd = 4;

        this.spawned = false;
        this.spawnPeriod = 2; // in sec
        this.totalRows = 4;

        this.t1 = 0;
        this.t2 = 0;
    }

    initObject(initData) {
        super.initObject(initData);

        // set animation start frame
        this.currentFrame = random(0, this.numFrames - 1);
    }

    updateObject() {
        // check if time to spawn
        if (this.state.timerObject.timerCurrentValue % this.spawnPeriod == 0) {
            this.spawned = true;
        }
        
        if(! this.spawned) {
            return;
        }

        super.updateObject();
        this.animateFrame();
    }

    drawObject() {
        if(! this.spawned) {
            return;
        }

        super.drawObject();
    }

    animateFrame() {
        this.t2 = Math.floor(frameStartTime / this.animSpeed);

        if (this.t1 < this.t2) {
            this.currentFrame = (++this.currentFrame) % this.numFrames;
            this.t1 = this.t2;
        }
    }

    respondToCollision() {
        this.state.scoreObject.score += this.pointsToAdd * this.state.pointsMultiplier.activeMultiplier;
        this.respawnAfterDraw = true;
        soundManager.playSound(this.enemyID);
    }
}

export { Star };