'use strict'

class PendingPlayBackground {
    static previousTextureID = ""; // keep value on destruction 

    constructor(that) {
        this.playBackground = that;

        this.transitionSteps = FPS;
        this.stepMagnitude = 1 / this.transitionSteps;
        this.canvasAlphaValue = 0;
        this.transition = false;
        this.newTextureID = "";
    }

    drawWithAlpha(alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        textureManager.drawTexture(this.newTextureID, this.playBackground.currentFrame, this.playBackground.currentRow,
            this.playBackground.sWidth, this.playBackground.sHeight, this.playBackground.position.x, this.playBackground.position.y,
            this.playBackground.dWidth, this.playBackground.dHeight);
        ctx.restore();
    }

    drawObject() {
        this.drawWithAlpha(this.canvasAlphaValue);

        this.canvasAlphaValue += this.stepMagnitude;
        this.transitionSteps -= 1;

        if (this.transitionSteps == 0) {
            this.transition = false;
            this.playBackground.textureID = this.newTextureID;
        }
    }
}

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
        this.stepTime = 25; // in ms
        this.stepT1 = 0;
        this.stepT2 = 0;

        this.textureIDs = ["play-background-1", "play-background-2", "play-background-3"];

        this.pendingPlayBackground = new PendingPlayBackground(this);
    }

    initObject(initData) {
        super.initObject(initData);

        this.intialPos = new Vector2D(this.position.x, this.position.y);
        this.initRumblePattern();

        // define textureID
        if (this.pendingPlayBackground.constructor.previousTextureID.length == 0) {
            this.textureID = this.textureIDs[random(0, this.textureIDs.length - 1)];
            this.pendingPlayBackground.constructor.previousTextureID = this.textureID;
        } else {
            this.pendingPlayBackground.transition = true;
            this.pendingPlayBackground.newTextureID = this.textureIDs[random(0, this.textureIDs.length - 1)];
            this.textureID = this.pendingPlayBackground.constructor.previousTextureID;
            this.pendingPlayBackground.constructor.previousTextureID = this.pendingPlayBackground.newTextureID;
        }

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
        this.stepT2 = frameStartTime;

        // rumble once every n seconds
        // side effect with two rumbles in a row occurs
        if (this.t1 < this.t2) {
            // console.log(this.t1,this.t2);
            this.rumble = true;
            this.rumblePeriod = random(5, 6); // define next call period
        }

        // avoid t2 < t1, which occurs often on rumblePeriod increased 
        this.t1 = this.t2;


        if (this.rumble && (this.stepT2 - this.stepT1 > this.stepTime)) {
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

            this.stepT1 = this.stepT2;
        }
    }

    drawObject() {
        super.drawObject();

        if (this.pendingPlayBackground.transition) {
            this.pendingPlayBackground.drawObject();
        }
    }
}