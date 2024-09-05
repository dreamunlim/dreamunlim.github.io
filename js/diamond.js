import { Star } from "./star.js";
import { GameObject } from "./gameObject.js";
import { soundManager } from "./soundManager.js";

class Diamond extends Star {
    constructor () {
        super();

        this.pointsToAdd = 5;

        this.spawnPeriod = 3; // in sec
        this.totalRows = 6;
    }

    initObject(initData) {
        super.initObject(initData);

        // trigger image decode in advance to avoid a gameplay micro-freeze on the sprite first draw
        this.triggerImageDecode();
    }

    triggerImageDecode() {
        const [x, y] = [this.position.x, this.position.y];
        [this.position.x, this.position.y] = [0, 0];
        GameObject.prototype.drawObject.call(this);
        [this.position.x, this.position.y] = [x, y];
    }

    spawnObject() {
        let totalSecondsPassed = Math.floor(this.state.timerObject.totalTimePassed / 1000);
        if (totalSecondsPassed != 0 &&
            totalSecondsPassed % this.spawnPeriod == 0) {
            this.spawned = true;
        }
    }
    
    respondToCollision() {
        this.state.scoreObject.score += this.pointsToAdd * this.state.pointsMultiplier.activeMultiplier;
        this.respawnAfterDraw = true;
        soundManager.playSound(this.enemyID);
    }
}

export { Diamond };