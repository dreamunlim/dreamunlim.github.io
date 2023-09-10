import { GameObject } from "./gameObject.js";
import { ctx, canvasInitialWidth, canvasInitialHeight, initialTransform } from "./canvas.js";
import { random } from "./auxiliary.js";
import { FPS, frameStartTime } from "./main.js";
import { textureManager } from "./textureManager.js";

class BackgroundShake {
    constructor(that) {
        this.playBackground = that;

        this.t1 = 0;
        this.t2 = 0;
        this.period = 5; // in sec
        this.animate = false;
        this.maxAngle = 4; // in degrees (non-clipping max for +-10px offset is 1.29°)
        this.maxOffset = 10; // in px (available margin is +-20px)
        this.duration = FPS; // in frames
        this.initialIntesity = 1;
        this.currentIntensity = this.initialIntesity;
        this.intensityDecreaseValue = this.initialIntesity / this.duration;
        this.centerX = canvasInitialWidth / 2;
        this.centerY = canvasInitialHeight / 2;
        this.angle = 0;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    intensitySquared() {
        return this.currentIntensity * this.currentIntensity;
    }

    undoTranslateRotate() {
        ctx.setTransform(initialTransform);
    }
    
    update() {
        if (this.currentIntensity > 0) {
            this.angle = this.maxAngle * this.intensitySquared() * random(-1, 1, "float");
            this.offsetX = this.maxOffset * this.intensitySquared() * random(-1, 1, "float");
            this.offsetY = this.maxOffset * this.intensitySquared() * random(-1, 1, "float");
            this.currentIntensity -= this.intensityDecreaseValue;
        } else {
            this.animate = false;
            this.currentIntensity = this.initialIntesity;
        }
    }

    draw() {
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.translate(-this.centerX + this.offsetX, -this.centerY + this.offsetY);
    }
}

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
        ctx.globalAlpha = alpha;
        textureManager.drawTexture(this.newTextureID, this.playBackground.currentFrame, this.playBackground.currentRow,
            this.playBackground.sWidth, this.playBackground.sHeight, this.playBackground.position.x, this.playBackground.position.y,
            this.playBackground.dWidth, this.playBackground.dHeight);
        ctx.globalAlpha = 1; // restore default value
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

        this.backgrounds = {
            blue: {
                "css-class": "blue-play-bg",
                "textureID": "play-background-1"
            },
            green: {
                "css-class": "green-play-bg",
                "textureID": "play-background-2"
            },
            purple: {
                "css-class": "purple-play-bg",
                "textureID": "play-background-3"
            }
        }
        
        this.pendingPlayBackground = new PendingPlayBackground(this);
        this.backgroundShake = new BackgroundShake(this);
    }

    initObject(initData) {
        super.initObject(initData);

        const backgroundsArray = Object.keys(this.backgrounds);
        const randomBackground = backgroundsArray[random(0, backgroundsArray.length - 1)];

        // define html body colour
        document.body.className = this.backgrounds[randomBackground]["css-class"];
        
        // define textureID
        if (this.pendingPlayBackground.constructor.previousTextureID.length == 0) {
            this.textureID = this.backgrounds[randomBackground]["textureID"];
            this.pendingPlayBackground.constructor.previousTextureID = this.textureID;
        } else {
            this.pendingPlayBackground.transition = true;
            this.pendingPlayBackground.newTextureID = this.backgrounds[randomBackground]["textureID"];
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

    updateObject() {
        this.backgroundShake.t2 = Math.floor(frameStartTime / (this.backgroundShake.period * 1000));

        // rumble once every n seconds
        // side effect with two rumbles in a row occurs
        if (this.backgroundShake.t1 < this.backgroundShake.t2) {
            // console.log(this.backgroundShake.t1, this.backgroundShake.t2);
            this.backgroundShake.animate = true;
            this.backgroundShake.period = random(5, 6); // define next call period
        }

        // avoid t2 < t1, which occurs often on rumble period increased 
        this.backgroundShake.t1 = this.backgroundShake.t2;

        if (this.backgroundShake.animate) {
            this.backgroundShake.update();            
        }
    }

    drawObject() {
        if (this.backgroundShake.animate) {
            this.backgroundShake.draw();            
        }

        super.drawObject();

        if (this.pendingPlayBackground.transition) {
            this.pendingPlayBackground.drawObject();
        }

        if (this.backgroundShake.animate) {
            this.backgroundShake.undoTranslateRotate();
        }
    }
}

export { PlayBackground };