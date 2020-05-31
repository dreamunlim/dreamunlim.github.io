'use strict'

class Heart extends Enemy {
    constructor () {
        super();

        this.t1 = 0;
        this.t2 = 0;
        this.animate = false;
        this.delayAnim = random(250, 500); // in ms
        this.beatPattern = [1, .97, .93, .9, .93, .97, 1, 1.03];
        this.currStep = 0;
    }

    initObject(initData) {
        super.initObject(initData);

        this.initialWidth = this.dWidth;
        this.initialHeight = this.dHeight;
    }

    updateObject() {
        super.updateObject();

        // check delay passed
        if (! this.animate) {
            var t = Math.floor(time / this.delayAnim);
            this.animate = t ? true : this.animate;
        }
        
        this.t2 = Math.floor(time / this.animSpeed);

        // do beat step
        if ((this.t1 < this.t2) && this.animate) {
            // prevent shrinking
            this.dWidth = this.initialWidth;
            this.dHeight = this.initialHeight;

            this.dWidth = this.beatPattern[this.currStep] * this.dWidth;
            this.dHeight = this.beatPattern[this.currStep] * this.dHeight;

            this.currStep = (++this.currStep) % this.beatPattern.length;

            this.t1 = this.t2;
        }
    }


    drawObject() {
        super.drawObject();
    }
}