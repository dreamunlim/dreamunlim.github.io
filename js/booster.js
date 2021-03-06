'use strict'

class Booster extends Enemy {
    constructor () {
        super();

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
        if((time - this.state.timerObject.boosterPickUpTime) > this.keepCollidedStatus) {
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
}