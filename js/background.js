'use strict'

class Background extends GameObject {
    t1 = 0;
    t2 = 0;
    seconds = 3;

    constructor() {
        super();
    }

    initObject(initData) {
        super.initObject(initData);
    }

    updateObject() {
        super.updateObject();

        // rumble once every 3-4 sec
        if (this.t1 < this.t2) {
            // this.rumble();
            this.t1 = this.t2; // to skip call in every frame
            this.seconds = random(3, 4); // define next call period
        }

        this.t2 = Math.floor(time / (this.seconds * 1000));
    }


    drawObject() {
        super.drawObject();
    }

    rumble() {
        console.log(this.seconds);
    }
}