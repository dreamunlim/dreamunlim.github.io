'use strict'

class Spider extends Enemy {
    constructor() {
        super();

        this.threadWidth = 2;
        this.time = 37.5 // in frames
        this.dist = 640;

        this.animate = false;
        this.animDuration = 1000; // in ms
    }

    initObject(initData) {
        super.initObject(initData);

        this.velocity.y = this.dist / this.time;
        this.accel = this.velocity.y / this.time;

        // set negative accelaration at this point
        this.halfDist = this.dist / 2 - this.dHeight;

        // keep initial velocity for respawn 
        this.initial.velocity = this.velocity.y;
    }

    increaseVelocity() {
        this.time = this.time - 2.5;
        this.initial.velocity = this.dist / this.time;
        this.accel = this.initial.velocity / this.time;
    }

    updateObject() {
        super.updateObject();

        // decide velocity increase
        if (this.time > 20) {
            if (this.prevScoreValue % 50 >= 46 &&
                this.state.scoreObject.score % 50 <= 3) {
                this.increaseVelocity();
            }
            this.prevScoreValue = this.state.scoreObject.score;
        }

        // stop at bottom boundary
        if (this.position.y >= this.halfDist) {
            this.acceleration.y = -this.accel;
        }

        // animate only once
        if ((this.position.y >= this.dist - this.dHeight - 10) && !this.animate) {
            this.animate = true;
            this.t1 = time;
        }

        if (this.animate) {
            super.animateFrame();

            // stop animation
            if (time - this.t1 > this.animDuration) {
                this.animate = false;
                this.currentFrame = 0;
            }
        }
    }


    drawObject() {
        // draw web thread
        ctx.fillStyle = 'rgba(124, 124, 124, 0.5)';
        ctx.fillRect(this.position.x + this.dWidth / 2, 0, this.threadWidth, this.position.y + 4);

        super.drawObject();
    }
}