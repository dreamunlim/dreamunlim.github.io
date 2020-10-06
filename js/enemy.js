'use strict'

class Enemy extends GameObject {
    constructor () {
        super();

        // enemy owner
        this.state = gameStateMachine.stack[1];

        this.enemyID = this.constructor.name.toLowerCase();

        this.spawned = true;
    }

    initObject(initData) {
        super.initObject(initData);

        // define position
        if(! this.position.x) {
            var lane = random(1, 5);
            this.position.x = this.lanes[lane];

            // spider specific adjustments
            if (this.enemyID == "spider") {
                this.state.spiderBusyLane = lane;
            }
        }
        
        if(! this.position.y) {
            this.position.y = -this.dHeight;
        }

        // initial values for respawn
        this.initial = {
            position: this.position.y,
            velocity: initData.velocity.y,
            acceleration: initData.acceleration.y
        }
    }

    respawn() {
        var lane = random(1, 5);
        this.position.x = this.lanes[lane];
        this.position.y = this.initial.position;
        this.velocity.y = this.initial.velocity;
        this.acceleration.y = this.initial.acceleration;

        switch (this.enemyID) {
            case "booster":
                this.spawned = false;
                break;
            case "star":
            case "diamond":
                this.spawned = false;
                this.currentRow = random(0, this.totalRows - 1);
                break;
            case "spider":
                // don't spawn spiders onto same lane
                if (this.state.spiderBusyLane == lane) {
                    if ((++lane) > 5) lane = 1;
                    this.position.x = this.lanes[lane];
                }
                this.state.spiderBusyLane = lane;
                break;
        }
    }

    updateObject() {
        super.updateObject();

        // respawn condition
        if (this.position.y > height) {
            this.respawn();
        } else if (this.position.y < this.initial.position) {
            this.respawn();
        }
    }

    drawObject() {
        super.drawObject();
    }
}