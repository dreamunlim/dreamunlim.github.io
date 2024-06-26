import { GameObject } from "./gameObject.js";
import { mod } from "./auxiliary.js";
import { frameStartTime } from "./main.js";
import { inputHandler } from "./inputHandler.js";
import { collisionManager } from "./collisionManager.js";
import { gameStateMachine } from "./gameStateMachine.js";

class Player extends GameObject {
    constructor() {
        super();

        // player owner
        this.state = gameStateMachine.stack[gameStateMachine.stack.length - 1];
        
        this.state.playerObject = this;

        this.currLane = 4;
        this.targLane = 4;
        this.numLanes = this.lanes.length;

        this.teleport = false;
        this.animate = false;
        this.time = 9.9; // in frames
        this.dist = this.lanes[1] - this.lanes[0]; // constant
        this.accel = 2 * this.dist / (this.time * this.time); // a = 2d/t^2 when initial velocity == 0

        this.lives = 0;
        this.revive = false;
        this.immune = false;
        this.immuneStartTime = 0;
        this.immuneDuration = 1000; // in ms
        this.flickerDuration = 30; // in ms
    }

    initObject(initData) {
        super.initObject(initData);

        // keep initial dimensions for flicker reset
        this.initial = {
            dWidth: this.dWidth,
            dHeight: this.dHeight
        }
    }

    updateObject() {
        super.updateObject();
        super.animateFrame();
        this.handleRevive();
        this.handleImmunity();

        // exit update if pause button tapped
        if (inputHandler.mouseLeftPressed) {
            if (collisionManager.mouseButtonCollision(inputHandler.mEvent, this.state.pauseButton)) {
                return;
            }
        }

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
                    this.currLane = this.targLane = 7;
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
        if (!this.animate && inputHandler.leftPressed) {
            this.targLane = mod(--this.targLane, this.numLanes);
            this.currentRow = 0;
        }
        if (!this.animate && inputHandler.rightPressed) {
            this.targLane = (++this.targLane) % this.numLanes;
            this.currentRow = 1;
        }
        // avoid lane fly-throughs on TVs due to slow 'keyup' event
        if (this.state.smartTV) {
            inputHandler.leftPressed = false;
            inputHandler.rightPressed = false;
        }

        // mouse
        if (!this.animate && inputHandler.mouseLeftPressed) {
            if (inputHandler.mEvent.clientX < window.innerWidth / 2) {
                this.targLane = mod(--this.targLane, this.numLanes);
                this.currentRow = 0;
            }
            else {
                this.targLane = (++this.targLane) % this.numLanes;
                this.currentRow = 1;
            }

            // stop auto movement
            inputHandler.mouseLeftPressed = false;
        }

        // decide movement direction
        if (this.targLane == 0 && this.currLane == 1) {
            // left edge teleport
            this.acceleration.x = -this.accel;
            this.animate = true;
            this.teleport = true;

        } else if (this.targLane == 8 && this.currLane == 7) {
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
    }

    drawObject() {
        if (this.teleport) {
            // draw one sprite offscreen
            var x = this.position.x;

            if (this.acceleration.x < 0) {
                this.position.x = this.position.x + 7 * this.dist;
            }
            else {
                this.position.x = this.position.x - 7 * this.dist;
            }

            super.drawObject();

            this.position.x = x;
        }

        super.drawObject();
    }

    handleRevive() {
        if (this.revive) {
            this.revive = false;
            this.immune = true;
            this.immuneStartTime = frameStartTime;
            this.soundPlayedOnce = true;

            // log event
            gtag("event", "player_revive");
        }
    }

    handleImmunity() {
        // remove immunity
        if ((frameStartTime - this.immuneStartTime) > this.immuneDuration) {
            this.immune = false;
            delete this.soundPlayedOnce;
        }

        // reset flicker
        this.dWidth = this.initial.dWidth;
        this.dHeight = this.initial.dHeight;
        
        // flicker
        if (this.immune) {
            if (Math.floor(frameStartTime / this.flickerDuration) % 2) {
                // draw trasparent pixels
                this.dWidth = 1;
                this.dHeight = 1;
            }
        }
    }

}

export { Player };