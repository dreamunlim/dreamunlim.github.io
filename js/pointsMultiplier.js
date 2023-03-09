import { Info } from "./info.js";
import { random, drawText } from "./auxiliary.js";
import { frameStartTime } from "./main.js";

class PointsMultiplier extends Info {
    constructor(initData) {
        super(initData);

        this.state.pointsMultiplier = this;

        this.active = false;
        this.duration = 0; // in ms
        this.activeMultiplier = 1;
    }

    activate() {
        this.active = true;
        this.duration = random(3, 5) * 1000;
        this.activeMultiplier = random(3, 7);
    }

    updateObject() {
        if (this.active) {
            if ((frameStartTime - this.state.timerObject.boosterPickUpTime) > this.duration) {
                this.active = false;
                this.activeMultiplier = 1;
            }
        }
    }

    drawObject() {
        if (this.active) {
            drawText("x" + this.activeMultiplier, this.position.x + 2, this.position.y + 2, this.font, "center", this.fontShadowColour);
            drawText("x" + this.activeMultiplier, this.position.x, this.position.y, this.font, "center", this.fontColour);
        }
    }
}

export { PointsMultiplier };