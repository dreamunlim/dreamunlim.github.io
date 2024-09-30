import { Enemy } from "./enemy.js";
import { soundManager } from "./soundManager.js";

class Watermelon extends Enemy {
    constructor () {
        super();

        this.pointsToAdd = 7;

        this.spawned = false;
        this.spawnPeriod = 4; // in sec
    }
    
    spawn() {
        let totalSecondsPassed = Math.floor(this.state.timerObject.totalTimePassed / 1000);
        if (totalSecondsPassed != 0 &&
            totalSecondsPassed % this.spawnPeriod == 0) {
            this.spawned = true;
        }
    }

    updateObject() {
        this.spawn();

        if (! this.spawned) {
            return;
        }

        super.updateObject();
        super.animateFrame();
    }

    drawObject() {
        if (! this.spawned) {
            return;
        }

        super.drawObject();
    }

    respondToCollision() {
        this.state.playerObject.lives += 1;
        this.state.scoreObject.score += this.pointsToAdd * this.state.pointsMultiplier.activeMultiplier;
        this.respawnAfterDraw = true;
        soundManager.playSound("heart");
    }
}

export { Watermelon };