'use strict'

class GameObject {
    constructor () {
        
    }

    initObject(initData) {
        this.position = initData.position;
        this.velocity = initData.velocity;
        this.acceleration = initData.acceleration;
        
        this.textureID = initData.textureID;

        this.width = initData.width;
        this.height = initData.height;

        this.currentFrame = initData.currentFrame;
        this.currentRow = initData.currentRow;

        this.numFrames = initData.numFrames;

        this.animSpeed = initData.animSpeed;
    }

    updateObject() {

    }

    drawObject() {
        textureManager.drawTexture(this.textureID, this.currentFrame, this.currentRow, 
            this.width, this.height, this.position.x, this.position.y, this.width, this.height);        
    }
}