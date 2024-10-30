import { GameObject } from "./gameObject.js";
import { random } from "./auxiliary.js";
import { canvasInitialHeight } from "./canvas.js";
import { collisionManager } from "./collisionManager.js";
import { gameStateMachine } from "./gameStateMachine.js";

class Enemy extends GameObject {
    constructor () {
        super();

        // enemy owner
        this.state = gameStateMachine.stack[1];

        this.enemyID = this.constructor.name.toLowerCase();
        this.spawned = true;
        this.respawnAfterDraw = false;
    }

    initObject(initData) {
        super.initObject(initData);

        // define position
        if (! this.position.x) {
            var lane = random(1, 7);
            this.position.x = this.lanes[lane];

            // spider specific adjustments
            if (this.enemyID == "spider") {
                this.placeSpider(lane);
            }
        }

        if (! this.position.y) {
            this.position.y = -this.dHeight;
        }

        // initial values for respawn
        this.initial = {
            position: this.position.y,
            velocity: initData.velocity.y,
            acceleration: initData.acceleration.y
        }
    }

    respawn() {
        var lane = random(1, 7);
        this.position.x = this.lanes[lane];
        this.position.y = this.initial.position;
        this.velocity.y = this.initial.velocity;
        this.acceleration.y = this.initial.acceleration;

        switch (this.enemyID) {
            case "booster":
            case "watermelon":
                this.spawned = false;
                break;
            case "spider":
                this.placeSpider(lane);
                break;
        }
    }

    updateObject() {
        // respawn after collision in previous frame 
        if (this.respawnAfterDraw) {
            this.respawn();
            this.respawnAfterDraw = false;
        }

        super.updateObject();
        this.checkPlayerEnemyCollision();
        this.respawnWhenOffscreen();
    }

    drawObject() {
        super.drawObject();
    }

    checkPlayerEnemyCollision() {
        // skip collision check
        if (this.position.y + this.dHeight < canvasInitialHeight / 2) {
            return;
        }

        var collided = collisionManager.playerEnemyCollision(this.state.playerObject, this);
        if (collided) {
            this.respondToCollision();
        }
    }

    respawnWhenOffscreen() {
        if (this.position.y > canvasInitialHeight) {
            this.respawn();
        } else if (this.position.y < this.initial.position) {
            this.respawn();
        }
    }
}

export { Enemy };