'use strict'

class InitData {
    constructor (pos, veloc, accel, texID, width, height, currFrame,
        currRow, numFrames, animSpeed, callbackID = 0) {
        this.position = pos;
        this.velocity = veloc;
        this.acceleration = accel;
        
        this.textureID = texID;

        this.width = width;
        this.height = height;

        this.currentFrame = currFrame;
        this.currentRow = currRow;

        this.numFrames = numFrames;

        this.animSpeed = animSpeed;

        this.callbackID = callbackID;
    }
}