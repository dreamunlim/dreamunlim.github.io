'use strict'

class Player extends GameObject {
    constructor() {
        super();

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
        this.initial.dWidth = this.dWidth;
        this.initial.dHeight = this.dHeight;
    }

    updateObject() {
        super.updateObject();
        super.animateFrame();

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
        if (inputHandler.mouseLeftPressed && !this.animate) {
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
        var enemyList = gameStateMachine.stack[gameStateMachine.stack.length - 1].level.layers[0];
        var booster = enemyList[2];

        // enemy indexes: [3, 5]
        if (! this.immune) {
            for (var i = 3; i != enemyList.length; ++i) {
                var enemy = enemyList[i];
                var collided = collisionManager.playerEnemyCollision(this, enemy);

                if (collided) {
                    this.immune = true;
                    this.t1 = time;
                    soundManager.playSound(enemy.constructor.name.toLowerCase());
                }
            }
        }

        // check booster explicitly 
        var collided = collisionManager.playerEnemyCollision(this, booster);
        if (collided) {
            soundManager.playSound(booster.constructor.name.toLowerCase());
            booster.respawn();
        }

        // remove immunity
        this.t2 = time;
        if ((this.t2 - this.t1) > this.immuneDuration) {
            this.immune = false;
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