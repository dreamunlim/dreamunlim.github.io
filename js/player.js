'use strict'

class Player extends GameObject {
    constructor() {
        super();

        // player owner
        this.state = gameStateMachine.stack[gameStateMachine.stack.length - 1];

        this.currLane = 3;
        this.targLane = 3;
        this.numLanes = this.lanes.length;

        this.teleport = false;
        this.animate = false;
        this.time = 5; // in frames
        this.dist = this.lanes[1] - this.lanes[0]; // constant
        this.accel = 2 * this.dist / (this.time * this.time); // a = 2d/t^2 when initial velocity == 0

        this.immune = false;
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

        // exit update if pause button tapped
        if (inputHandler.mouseLeftPressed) {
            if (collisionManager.mouseButtonCollision(inputHandler.mEvent, gameStateMachine.stack[gameStateMachine.stack.length - 1].pauseButton)) {
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
            this.currentRow = 0;
        }
        if (inputHandler.rightPressed && !this.animate) {
            this.targLane = (++this.targLane) % this.numLanes;
            this.currentRow = 1;
        }

        // mouse
        if ((inputHandler.documentMouseLeftPressed || inputHandler.mouseLeftPressed) && !this.animate) {
            if (inputHandler.mEvent.clientX < window.innerWidth / 2) {
                this.targLane = mod(--this.targLane, this.numLanes);
                this.currentRow = 0;
            }
            else {
                this.targLane = (++this.targLane) % this.numLanes;
                this.currentRow = 1;
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
        inputHandler.documentMouseLeftPressed = false;


        this.checkPlayerEnemyCollision();
        this.flickerOnCollision();
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

    checkPlayerEnemyCollision() {
        var enemyLayer = this.state.level.layers[1];

        for (var i = 0; i != enemyLayer.length; ++i) {
            var enemy = enemyLayer[i];
            var enemyID = enemy.constructor.name.toLowerCase();

            // skip collision check
            if (enemy.position.y + enemy.dHeight < height / 2) {
                continue;
            }

            var collided = collisionManager.playerEnemyCollision(this, enemy);

            if (collided) {
                if (enemyID == "booster") {
                    this.state.timerObject.boosterPickUpTime = time;
                    this.state.scoreObject.score += 3;
                    this.state.boosterObject.collided = true;
                    enemy.respawn();
                    soundManager.playSound(enemyID);
                }

                if (enemyID == "star") {
                    this.state.scoreObject.score += 2;
                    enemy.respawn();
                    soundManager.playSound(enemyID);
                }

                if (enemyID == "heart") {
                    this.state.scoreObject.score += 1;
                    enemy.respawn();
                    soundManager.playSound(enemyID);
                }

                if (enemyID == "spider") {
                    // if player-spider-booster collided at the same time
                    if (this.state.boosterObject.collided) {
                        this.immune = true;
                        this.t1 = time;
                    }

                    if (this.immune) {
                        // play sound once per immunity duration
                        if (! this.soundPlayedOnce) {
                            this.soundPlayedOnce = true;
                            soundManager.playSound(enemyID);
                        }
                    }

                    if (! this.immune) {
                        // avoid GameoverState pushed second time in a row  
                        if (! gameStateMachine.pendingList.length) {
                            this.state.switchToGameOverState();
                        }
                        soundManager.playSound(enemyID);
                    }
                }
            }
        }

        // remove immunity
        if ((time - this.t1) > this.immuneDuration) {
            this.immune = false;
            delete this.soundPlayedOnce;
        }
    }

    flickerOnCollision() {
        // reset flicker
        this.dWidth = this.initial.dWidth;
        this.dHeight = this.initial.dHeight;
        
        // flicker
        if (this.immune) {
            if (Math.floor(time / this.flickerDuration) % 2) {
                // draw trasparent pixels
                this.dWidth = 1;
                this.dHeight = 1;
            }
        }
    }

}