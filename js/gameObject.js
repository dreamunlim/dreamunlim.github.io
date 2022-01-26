import { FPS, frameStartTime } from "./main.js";
import { textureManager } from "./textureManager.js";
import { gameStateMachine } from "./gameStateMachine.js";

class GameObject {
    constructor () {
        this.lanes = gameStateMachine.stack[gameStateMachine.stack.length - 1].lanes;
    }

    initObject(initData) {
        this.rescaleVelocAccel(initData);

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
    }
    
    animateFrame() {
        this.currentFrame = Math.floor((frameStartTime / this.animSpeed) % this.numFrames);
    }

    updateObject() {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
    }

    drawObject() {
        textureManager.drawTexture(this.textureID, this.currentFrame, this.currentRow, 
            this.sWidth, this.sHeight, this.position.x, this.position.y, this.dWidth, this.dHeight);        
    }

    rescaleVelocAccel(initData) {
        // approximate initial 30FPS motion with doubled FPS
        if (initData.velocity.y) {
            initData.velocity = initData.velocity.divide(FPS / 30);
        }

        if (initData.acceleration.y) {
            initData.acceleration = initData.acceleration.divide(3);
        }
    }
}

export { GameObject };