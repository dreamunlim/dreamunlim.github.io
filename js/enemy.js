'use strict'

class Enemy extends GameObject {
    constructor () {
        super();
    }

    initObject(initData) {
        super.initObject(initData);

        // define position
        if(! this.position.x) {
            this.position.x = this.lanes[random(1, 5)];
            this.position.y = -this.dHeight;
        }

        // initial values for respawn
        this.initial = {
            velocity: initData.velocity.y,
            acceleration: initData.acceleration.y
        }
    }

    respawn() {
        this.position.x = this.lanes[random(1, 5)];
        this.position.y = -this.dHeight;
        this.velocity.y = this.initial.velocity
        this.acceleration.y = this.initial.acceleration;
    }

    updateObject() {
        super.updateObject();

        // respawn condition
        if (this.position.y > height) {
            this.respawn();
        } else if (this.position.y < -this.dHeight) {
            this.respawn();
        }
    }

    drawObject() {
        super.drawObject();
    }
}