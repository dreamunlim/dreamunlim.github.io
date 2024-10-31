import { Enemy } from "./enemy.js";
import { ctx, canvasInitialHeight } from "./canvas.js";
import { frameStartTime } from "./main.js";
import { soundManager } from "./soundManager.js";

class Spider extends Enemy {
    constructor() {
        super();

        this.threadWidth = 2;
        this.time = 60; // in frames
        this.timeLowestBoundary = 37.5;
        this.timeDecreaseSteps = 6;
        this.timeDecreaseValue = ((this.time - this.timeLowestBoundary) / this.timeDecreaseSteps).toFixed(3) * 1;
        this.dist = canvasInitialHeight;

        this.animate = false;
        this.animDuration = 1000; // in ms

        this.occupiedLane = null;

        delete this.respawnAfterDraw;
    }

    initObject(initData) {
        const lane = super.initObject(initData);
        this.placeSpider(lane);

        this.velocity.y = this.dist / this.time;
        this.accel = this.velocity.y / this.time;

        // set negative accelaration at this point
        this.halfDist = this.dist / 2 - this.dHeight;

        // keep initial velocity for respawn 
        this.initial.velocity = this.velocity.y;
    }

    respawn() {
        const lane = super.respawn();
        this.placeSpider(lane);
    }

    increaseVelocity() {
        this.time = this.time - this.timeDecreaseValue;
        this.initial.velocity = this.dist / this.time;
        this.accel = this.initial.velocity / this.time;
    }

    updateObject() {
        super.updateObject();

        // decide velocity increase
        if (this.time > this.timeLowestBoundary) {
            const pointsToCollect = 50;
            const currentPointsBatch = this.state.scoreObject.score / pointsToCollect | 0;
            if (currentPointsBatch > this.previousPointsBatch) {
                this.increaseVelocity();
            }
            this.previousPointsBatch = currentPointsBatch;
        }

        // stop at bottom boundary
        if (this.position.y >= this.halfDist) {
            this.acceleration.y = -this.accel;
        }

        // animate only once
        if ((this.position.y >= this.dist - this.dHeight - 10) && !this.animate) {
            this.animate = true;
            this.t1 = frameStartTime;
        }

        if (this.animate) {
            super.animateFrame();

            // stop animation
            if (frameStartTime - this.t1 > this.animDuration) {
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

    placeSpider(lane) {
        // don't spawn spiders onto same lane
        if (this.state.spiderBusyLanes[lane] == 0) {
            this.state.spiderBusyLanes[lane] = 1;
            this.position.x = this.lanes[lane];
            // release previously occupied lane
            if (this.occupiedLane != null) {
                this.state.spiderBusyLanes[this.occupiedLane] = 0;
            }
            // store newly occupied lane
            this.occupiedLane = lane;
        } else {
            // loop through lanes [1, 7] to find the very first unoccupied one
            for (var i = 1; i <= 7; ++i) {
                if (this.state.spiderBusyLanes[i] == 0) {
                    this.state.spiderBusyLanes[i] = 1;
                    this.position.x = this.lanes[i];
                    // release previously occupied lane
                    if (this.occupiedLane != null) {
                        this.state.spiderBusyLanes[this.occupiedLane] = 0;
                    }
                    // store newly occupied lane
                    this.occupiedLane = i;
                }
            }
        }
    }

    respondToCollision() {
        // if player-spider-booster collided at the same time
        if (this.state.boosterObject.collided) {
            this.state.playerObject.immune = true;
            this.state.playerObject.immuneStartTime = frameStartTime;
        }

        if (! this.state.playerObject.immune) {
            if (this.state.playerObject.lives > 0) {
                this.state.playerObject.lives -= 1;
                this.state.playerObject.immune = true;
                this.state.playerObject.immuneStartTime = frameStartTime;
            } else {
                this.state.switchToGameOverState();
                soundManager.playSound(this.enemyID);
            }
        }

        if (this.state.playerObject.immune) {
            // play sound once per immunity duration
            if (! this.state.playerObject.soundPlayedOnce) {
                this.state.playerObject.soundPlayedOnce = true;
                soundManager.playSound(this.enemyID);
            }
        }
    }
}

export { Spider };