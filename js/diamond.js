'use strict'

class Diamond extends Star {
    constructor () {
        super();

        this.pointsToAdd = 3;

        this.spawnPeriod = 3; // in sec
        this.totalRows = 6;

        this.enemyClass = Object.getPrototypeOf(Object.getPrototypeOf(this));
    }

    updateObject() {
        // check if time to spawn
        var totalSecondsPassed = Math.floor(this.state.timerObject.totalTimePassed / 1000);
        if (totalSecondsPassed != 0 &&
            totalSecondsPassed % this.spawnPeriod == 0) {
            this.spawned = true;
        }

        if (! this.spawned) {
            return;
        }

        this.enemyClass.updateObject.call(this);
        super.animateFrame();
    }

    respondToCollision() {
        this.state.scoreObject.score += this.pointsToAdd;
        this.respawn();
        soundManager.playSound(this.enemyID);
    }
}