import { Star } from "./star.js";
import { soundManager } from "./soundManager.js";

class Diamond extends Star {
    constructor () {
        super();

        this.pointsToAdd = 5;

        this.spawnPeriod = 3; // in sec
        
        this.totalRows = 6;
        this.textures = [];
        this.rowsPerTexture = null;
    }

    initObject(initData) {
        super.initObject(initData);

        this.textures = this.textureID;
        this.textureID = this.textures[0];
        this.rowsPerTexture = this.totalRows / this.textures.length;
    }

    respawn() {
        super.respawn();

        this.textureID = this.textures[this.currentRow / this.rowsPerTexture | 0];
        this.currentRow = this.currentRow % this.rowsPerTexture;
    }

    spawn() {
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