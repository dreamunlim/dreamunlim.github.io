import { Star } from "./star.js";
import { soundManager } from "./soundManager.js";

class Diamond extends Star {
    constructor () {
        super();

        this.pointsToAdd = 5;

        this.spawnPeriod = 3; // in sec
        this.totalRows = 6;
    }

    spawn() {
        let totalSecondsPassed = Math.floor(this.state.timerObject.totalTimePassed / 1000);
        if (totalSecondsPassed != 0 &&
            totalSecondsPassed % this.spawnPeriod == 0) {
            this.spawned = true;
        }
    }
    
    respondToCollision() {
        this.state.scoreObject.score += this.pointsToAdd * this.state.pointsMultiplier.activeMultiplier;
        this.respawnAfterDraw = true;
        soundManager.playSound(this.enemyID);
    }
}

export { Diamond };