'use strict'

class Booster extends Enemy {
    constructor () {
        super();

        // booster owner
        this.state = gameStateMachine.stack[1];
        this.state.boosterObject = this;
        
        this.spawned = false;
        this.spawnTimerValue = 2; // in sec
    }

    initObject(initData) {
        super.initObject(initData);
    }

    updateObject() {
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