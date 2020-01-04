'use strict'

class GameObject {
    constructor () {
        
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
    }

    updateObject() {
        this.currentFrame = Math.floor((time / this.animSpeed) % this.numFrames);

        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
    }

    drawObject() {
        textureManager.drawTexture(this.textureID, this.currentFrame, this.currentRow, 
            this.sWidth, this.sHeight, this.position.x, this.position.y, this.dWidth, this.dHeight);        
    }
}