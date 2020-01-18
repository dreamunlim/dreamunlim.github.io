'use strict'

class Player extends GameObject {
    constructor() {
        super();

        this.lanes = gameStateMachine.stack[gameStateMachine.stack.length - 1].lanes; // offscreen lanes at sides
        this.currLane = 3;
        this.targLane = 3;
        this.numLanes = this.lanes.length;

        this.teleport = false;
        this.animate = false;
        this.time = FPS; // in frames
        this.dist = this.lanes[1] - this.lanes[0]; // constant
        // this.accel = 2 * this.dist / (this.time * this.time); // a = 2d/t^2 when initial velocity == 0
    }

    initObject(initData) {
        super.initObject(initData);

        this.accel = 2 * (this.dist * this.velocity.x * this.time) / (this.time * this.time);
        this.velocity.x = 0;
    }

    updateObject() {
        super.updateObject();

        this.currLane = this.targLane;

        // decide velocity and acceleration reset
        if (this.animate) {
            // snap player to targetX in this frame to avoid currX > targetX in next frame
            var snapLeft = (this.acceleration.x < 0) && (this.position.x <= this.lanes[this.targLane]);
            var snapRight = (this.acceleration.x > 0) && (this.position.x >= this.lanes[this.targLane]);

            if (snapLeft || snapRight) {
                this.position.x = this.lanes[this.targLane];
                this.velocity.x = 0;
                this.acceleration.x = 0;
                this.animate = false;

                // if it was a teleport snap
                if (this.teleport && snapLeft) {
                    this.currLane = this.targLane = 5;
                    this.position.x = this.lanes[this.targLane];
                    this.teleport = false;
                } else if (this.teleport && snapRight) {
                    this.currLane = this.targLane = 1;
                    this.position.x = this.lanes[this.targLane];
                    this.teleport = false;
                }
            }
        }

        // keyboard
        // disallow 'targLane' change during animation to avoid lane fly-throughs, especially at edges
        if (inputHandler.leftPressed && !this.animate) {
            this.targLane = mod(--this.targLane, this.numLanes);
        }
        if (inputHandler.rightPressed && !this.animate) {
            this.targLane = (++this.targLane) % this.numLanes;
        }

        // mouse
        if (inputHandler.mouseLeftPressed && !this.animate) {
            if (inputHandler.mEvent.clientX < window.innerWidth / 2) {
                this.targLane = mod(--this.targLane, this.numLanes);
            }
            else {
                this.targLane = (++this.targLane) % this.numLanes;
            }
        }

        // decide movement direction
        if (this.targLane == 0 && this.currLane == 1) {
            // left edge teleport
            this.acceleration.x = -this.accel;
            this.animate = true;
            this.teleport = true;

        } else if (this.targLane == 6 && this.currLane == 5) {
            // right edge teleport
            this.acceleration.x = this.accel;
            this.animate = true;
            this.teleport = true;

        } else if (this.targLane < this.currLane) {
            this.acceleration.x = -this.accel;
            this.animate = true;

        } else if (this.targLane > this.currLane) {
            this.acceleration.x = this.accel;
            this.animate = true;

        }


        // be sure 'player' has indeed had time to update itself
        inputHandler.leftPressed = false;
        inputHandler.rightPressed = false;
        inputHandler.mouseLeftPressed = false;
    }


    drawObject() {
        if (this.teleport) {
            // draw one sprite offscreen
            var x = this.position.x;

            if (this.acceleration.x < 0) {
                this.position.x = this.position.x + 5 * this.dist;
            }
            else {
                this.position.x = this.position.x - 5 * this.dist;
            }

            super.drawObject();

            this.position.x = x;
        }

        super.drawObject();
    }
}