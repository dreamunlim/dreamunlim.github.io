'use strict'

class GameObject {
    constructor () {
        this.lanes = gameStateMachine.stack[gameStateMachine.stack.length - 1].lanes;
    }

    initObject(initData) {
        this.position = initData.position;
        this.velocity = initData.velocity;
        this.acceleration = initData.acceleration;
        
        this.textureID = initData.textureID;

        this.sWidth = initData.sWidth;
        this.sHeight = initData.sHeight;

        this.dWidth = initData.dWidth;
        this.dHeight = initData.dHeight;

        this.currentFrame = initData.currentFrame;
        this.currentRow = initData.currentRow;

        this.numFrames = initData.numFrames;

        this.animSpeed = initData.animSpeed;

        this.collisionCircle = initData.collisionCircle;

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

    animateFrame() {
        this.currentFrame = Math.floor((time / this.animSpeed) % this.numFrames);
    }

    updateObject() {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);

        // respawn condition
        if (this.position.y > height) {
            this.respawn();
        } else if (this.position.y < -this.dHeight) {
            this.respawn();
        }
    }

    drawObject() {
        textureManager.drawTexture(this.textureID, this.currentFrame, this.currentRow, 
            this.sWidth, this.sHeight, this.position.x, this.position.y, this.dWidth, this.dHeight);        
    }
}