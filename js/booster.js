import { Enemy } from "./enemy.js";
import { FRAME_TIME, frameStartTime } from "./main.js";
import { soundManager } from "./soundManager.js";

class Booster extends Enemy {
    constructor () {
        super();

        this.state.boosterObject = this;

        this.pointsToAdd = 6;
        
        this.spawned = false;
        this.spawnTimerValue = 2; // in sec
        
        this.collided = false;
        this.keepCollidedStatus = FRAME_TIME * 2; // in frames
    }

    removeCollidedStatus() {
        if ((frameStartTime - this.state.timerObject.boosterPickUpTime) > this.keepCollidedStatus) {
            this.collided = false;
        }
    }

    spawn() {
        if (this.state.timerObject.timerCurrentValue == this.spawnTimerValue) {
            this.spawned = true;
        }
    }

    updateObject() {
        this.removeCollidedStatus();
        this.spawn();

        if (! this.spawned) {
            return;
        }

        super.updateObject();
    }

    drawObject() {
        if (! this.spawned) {
            return;
        }

        super.drawObject();
    }

    respondToCollision() {
        this.collided = true;
        this.state.pointsMultiplier.activate();
        this.state.timerObject.boosterPickUpTime = frameStartTime;
        this.state.scoreObject.score += this.pointsToAdd * this.state.pointsMultiplier.activeMultiplier;
        this.respawnAfterDraw = true;
        soundManager.playSound(this.enemyID);
    }
}

export { Booster };