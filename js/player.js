'use strict'

class Player extends GameObject {
    constructor (initData) {
        super(initData);
        
    }

    updateObject() {
        // have no idea why referencing class "InputHandler.leftPressed" property
        // works but referencing object "inputHandler." property does not work here
        if (InputHandler.leftPressed) {
            this.position.x -= this.velocity.x - this.acceleration.x;
        }
        if (InputHandler.rightPressed) {
            this.position.x += this.velocity.x + this.acceleration.x;
        }
        if (InputHandler.upPressed) {
            this.position.y -= this.velocity.y - this.acceleration.x;
        }
        if (InputHandler.downPressed) {
            this.position.y += this.velocity.y + this.acceleration.x;
        }
    }


    drawObject() {
        var t = performance.now();
        this.currentFrame = Math.floor((t / this.animSpeed) % this.numFrames);

        super.drawObject();
    }
}

console.log('PLAYER.JS');