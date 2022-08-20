import { Enemy } from "./enemy.js";
import { FRAME_TIME, frameStartTime } from "./main.js";
import { soundManager } from "./soundManager.js";

class Booster extends Enemy {
    constructor () {
        super();

        this.pointsToAdd = 6;

        this.state.boosterObject = this;
        
        this.spawned = false;
        this.spawnTimerValue = 2; // in sec
        
        this.collided = false;
        this.keepCollidedStatus = FRAME_TIME * 2; // in frames
    }

    initObject(initData) {
        super.initObject(initData);
    }

    updateObject() {
        // remove collided status
        if((frameStartTime - this.state.timerObject.boosterPickUpTime) > this.keepCollidedStatus) {
            this.collided = false;
        }
        
        // check if time to spawn
        if (this.state.timerObject.timerCurrentValue == this.spawnTimerValue) {
            this.spawned = true;
        }
        
        if(! this.spawned) {
            return;
        }

        super.updateObject();
    }

    drawObject() {
        if(! this.spawned) {
            return;
        }

        super.drawObject();
    }

    respondToCollision() {
        this.collided = true;
        this.state.timerObject.boosterPickUpTime = frameStartTime;
        this.state.scoreObject.score += this.pointsToAdd;
        this.respawnAfterDraw = true;
        soundManager.playSound(this.enemyID);
    }
}

export { Booster };