'use strict'

class Star extends Enemy {
    constructor () {
        super();

        this.pointsToAdd = 2;

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
        this.t2 = Math.floor(time / this.animSpeed);

        if (this.t1 < this.t2) {
            this.currentFrame = (++this.currentFrame) % this.numFrames;
            this.t1 = this.t2;
        }
    }

    respondToCollision() {
        this.state.scoreObject.score += this.pointsToAdd;
        this.respawnAfterDraw = true;
        soundManager.playSound(this.enemyID);
    }
}