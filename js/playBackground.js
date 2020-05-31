'use strict'

class PlayBackground extends GameObject {
    constructor() {
        super();

        this.t1 = 0;
        this.t2 = 0;
        this.seconds = 5;

        this.intialPos;
        this.rumblePattern;
        this.rumble = false;
        this.currStep = 0;
    }

    initObject(initData) {
        super.initObject(initData);

        this.intialPos = new Vector2D(this.position.x, this.position.y);
        this.rumblePattern = [[-1,1], [1,1], [1,-1], [-1,-1]];

        this.initRumblePattern();

        // remove unused properties
        delete this.lanes;
        delete this.velocity;
        delete this.acceleration;
        delete this.numFrames;
        delete this.animSpeed;
        delete this.collisionCircle;
    }

    initRumblePattern() {
        for (var i = 0; i < this.rumblePattern.length; ++i) {
            // distance range. max is 10 to stay within +-20px boundaries
            var scale = random(5,10);

            this.rumblePattern[i][0] = this.rumblePattern[i][0] * scale; // x
            this.rumblePattern[i][1] = this.rumblePattern[i][1] * scale; // y
        }
    }

    updateObject() {
        this.t2 = Math.floor(time / (this.seconds * 1000));

        // rumble once every n seconds
        // side effect with two rumbles in a row occurs
        if (this.t1 < this.t2) {
            // console.log(this.t1,this.t2);
            this.rumble = true;
            this.seconds = random(5, 6); // define next call period
        }

        // avoid t2 < t1, which occurs often on 'seconds' increased 
        this.t1 = this.t2;


        if (this.rumble) {
            // return to initial position
            if (this.currStep == this.rumblePattern.length) {
                var final = this.intialPos.subtract(this.position);
                this.position = this.position.add(final);
                this.currStep = 0;
                this.rumble = false;

            } else {
                var vec = new Vector2D(this.rumblePattern[this.currStep][0], this.rumblePattern[this.currStep][1]);
                this.position = this.position.add(vec);
                ++this.currStep;
            }
        }
    }


    drawObject() {
        super.drawObject();
    }
}