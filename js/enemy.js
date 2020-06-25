'use strict'

class Enemy extends GameObject {
    constructor () {
        super();

        this.spawned = true;
    }

    initObject(initData) {
        super.initObject(initData);

        // define position
        if(! this.position.x) {
            this.position.x = this.lanes[random(1, 5)];
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
        var enemyID = this.constructor.name.toLowerCase();

        this.position.x = this.lanes[random(1, 5)];
        this.position.y = this.initial.position;
        this.velocity.y = this.initial.velocity;
        this.acceleration.y = this.initial.acceleration;

        switch (enemyID) {
            case "booster":
                this.spawned = false;
                break;
            case "star":
                this.spawned = false;
                this.currentRow = (++this.currentRow) % this.totalRows;
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