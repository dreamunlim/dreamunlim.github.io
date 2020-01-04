'use strict'

class InitData {
    constructor (pos, veloc, accel, texID, sWidth, sHeight, dWidth, dHeight,
        currFrame, currRow, numFrames, animSpeed, callbackID = 0) {
        this.position = pos;
        this.velocity = veloc;
        this.acceleration = accel;
        
        this.textureID = texID;

        this.sWidth = sWidth;
        this.sHeight = sHeight;

        this.dWidth = dWidth;
        this.dHeight = dHeight;

        this.currentFrame = currFrame;
        this.currentRow = currRow;

        this.numFrames = numFrames;

        this.animSpeed = animSpeed;

        this.callbackID = callbackID;
    }
}