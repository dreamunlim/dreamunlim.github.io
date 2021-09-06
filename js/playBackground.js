'use strict'

class PlayBackground extends GameObject {
    constructor() {
        super();

        this.t1 = 0;
        this.t2 = 0;
        this.rumblePeriod = 5; // in sec

        this.intialPos = null;
        this.returnVec = null;
        this.rumblePattern = [[-1,1], [1,1], [1,-1], [-1,-1]];
        this.rumble = false;
        this.currStep = 0;

        this.textureIDs = ["play-background-1", "play-background-2", "play-background-3"];
    }

    initObject(initData) {
        super.initObject(initData);

        this.textureID =  this.textureIDs[random(0, this.textureIDs.length - 1)];
        this.intialPos = new Vector2D(this.position.x, this.position.y);

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
            var scale = random(5, 10);

            // substitute rumble pattern pair with a vector
            this.rumblePattern[i] = new Vector2D(this.rumblePattern[i][0] * scale, this.rumblePattern[i][1] * scale);
        }
    }

    updateObject() {
        this.t2 = Math.floor(frameStartTime / (this.rumblePeriod * 1000));

        // rumble once every n seconds
        // side effect with two rumbles in a row occurs
        if (this.t1 < this.t2) {
            // console.log(this.t1,this.t2);
            this.rumble = true;
            this.rumblePeriod = random(5, 6); // define next call period
        }

        // avoid t2 < t1, which occurs often on rumblePeriod increased 
        this.t1 = this.t2;


        if (this.rumble) {
            // return to initial position
            if (this.currStep == this.rumblePattern.length) {
                if (this.returnVec == null) {
                    this.returnVec = this.intialPos.subtract(this.position);
                }

                this.position = this.position.add(this.returnVec);
                this.currStep = 0;
                this.rumble = false;

            } else {
                var vec = this.rumblePattern[this.currStep];
                this.position = this.position.add(vec);
                ++this.currStep;
            }
        }
    }


    drawObject() {
        super.drawObject();
    }
}