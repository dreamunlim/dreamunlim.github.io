'use strict'

class Player extends GameObject {
    constructor (initData) {
        super(initData);
        
    }

    updateObject() {
        // have no idea why referencing class "InputHandler.leftPressed" property
        // works but referencing object "inputHandler." property does not work here
        if (InputHandler.leftPressed) {
            this.position.x -= 7;
        }
        if (InputHandler.rightPressed) {
            this.position.x += 7;
        }
        if (InputHandler.upPressed) {
            this.position.y -= 7;
        }
        if (InputHandler.downPressed) {
            this.position.y += 7;
        }
    }


    drawObject() {
        var t = performance.now();
        this.currentFrame = Math.floor((t / this.animSpeed) % this.numFrames);

        super.drawObject();
    }
}

console.log('PLAYER.JS');