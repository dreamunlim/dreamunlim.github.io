'use strict'

class Star extends Enemy {
    constructor () {
        super();

        // star owner
        this.state = gameStateMachine.stack[1];

        this.spawned = false;
        this.spawnPeriod = 2; // in sec
        this.totalRows = 4;
    }

    initObject(initData) {
        super.initObject(initData);
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
        super.animateFrame();
    }


    drawObject() {
        if(! this.spawned) {
            return;
        }

        super.drawObject();
    }
}