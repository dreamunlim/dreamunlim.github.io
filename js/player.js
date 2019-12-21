'use strict'

class Player extends GameObject {
    constructor () {
        super();
        
    }

    initObject(initData) {
        super.initObject(initData);
    }

    updateObject() {
        //reset velocity


        if (inputHandler.leftPressed) {
            this.position.x -= this.velocity.x - this.acceleration.x;
        }
        if (inputHandler.rightPressed) {
            this.position.x += this.velocity.x + this.acceleration.x;
        }
        if (inputHandler.upPressed) {
            this.position.y -= this.velocity.y - this.acceleration.x;
        }
        if (inputHandler.downPressed) {
            this.position.y += this.velocity.y + this.acceleration.x;
        }

        if (inputHandler.mouseLeftPressed) {
            var to;

            if (window.innerWidth < window.innerHeight) {
                to = new Vector2D(inputHandler.mEvent.clientX/scale, inputHandler.mEvent.clientY/scale);
            } else {
                to = new Vector2D(inputHandler.mEvent.offsetX, inputHandler.mEvent.offsetY);
            }

            this.position = to;

            // be sure 'player' has indeed had time to update itself  
            inputHandler.mouseLeftPressed = false;
        }

        super.updateObject();
    }


    drawObject() {
        this.currentFrame = Math.floor((time / this.animSpeed) % this.numFrames);

        super.drawObject();
    }
}

console.log('PLAYER.JS');