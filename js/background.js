'use strict'

class Background extends GameObject {
    constructor() {
        super();
    }

    initObject(initData) {
        super.initObject(initData);

        // remove unused properties
        delete this.lanes;
        delete this.velocity;
        delete this.acceleration;
        delete this.numFrames;
        delete this.animSpeed;
        delete this.collisionCircle;
    }

    updateObject() {
        
    }

    drawObject() {
        super.drawObject();
    }
}