'use strict'

class CharacterSelector {
    constructor() {
        this.selectorBox = {
            t1: 0,
            arrowHiddenDelay: 50, // in ms

            position: {x: 0, y: 95},
            width: 257,
            height: 325,
            drawLeftArrow: function () {
                if (this.skipLeftArrowDraw) {
                    if ((frameStartTime - this.t1) > this.arrowHiddenDelay) {
                        this.skipLeftArrowDraw = false;
                    }
                    return;
                }

                var leftArrowStartX = this.position.x;
                var leftArrowStartY = this.position.y + this.height / 2;
                
                var p1 = {x: leftArrowStartX, y: leftArrowStartY};
                var p2 = {x: leftArrowStartX + 10, y: leftArrowStartY - 10};
                var p3 = {x: leftArrowStartX + 10, y: leftArrowStartY + 10};

                drawTriangle(p1, p2, p3);
            },
            drawRightArrow: function () {
                if (this.skipRightArrowDraw) {
                    if ((frameStartTime - this.t1) > this.arrowHiddenDelay) {
                        this.skipRightArrowDraw = false;
                    }
                    return;
                }

                var rightArrowStartX = this.position.x + this.width;
                var rightArrowStartY = this.position.y + this.height / 2;

                var p1 = {x: rightArrowStartX, y: rightArrowStartY};
                var p2 = {x: rightArrowStartX - 10, y: rightArrowStartY - 10};
                var p3 = {x: rightArrowStartX - 10, y: rightArrowStartY + 10};

                drawTriangle(p1, p2, p3);
            }
        };

        this.charBox = function (that) {
            var that = that;

            return {
                t1: 0,
                charNameDelay: 1000, // in ms
                
                charName: null,
                displayCharName: false,

                position: {x: null, y: null}, // centered
                width: null, // varies per char
                height: 256, // constant
                updateCharBox: function () {
                    this.width = (this.height * that.playerInitData.sWidth) / that.playerInitData.sHeight;
                    this.position.x = that.selectorBox.position.x + (that.selectorBox.width - this.width) / 2;
                    this.position.y = that.selectorBox.position.y + (that.selectorBox.height - this.height) / 2;

                    this.t1 = frameStartTime;
                    this.charName = that.charList[that.charPointer].name;
                    this.displayCharName = true;
                },
                drawChar: function () {
                    textureManager.drawTexture(that.playerInitData.textureID, 0, 1, that.playerInitData.sWidth, that.playerInitData.sHeight,
                        this.position.x, this.position.y, this.width, this.height);

                    // char name
                    if (this.displayCharName) {
                        var x = that.selectorBox.position.x + that.selectorBox.width / 2;
                        var y = that.selectorBox.position.y;

                        drawText(this.charName, x + 2, y + 2,
                            "30px Orbitron", "center", "maroon", "middle", that.selectorBox.width);

                        drawText(this.charName, x, y,
                            "30px Orbitron", "center", "lightsalmon", "middle", that.selectorBox.width);

                        // remove name
                        if ((frameStartTime - this.t1) > this.charNameDelay) {
                            this.displayCharName = false;
                        }
                    }
                }
            }
        }(this);

        this.hi = {
            position: {x: 200, y: 78},
            sWidth: 120,
            sHeight: 134,
            dWidth: 72,
            dHeight: 80,
            drawHi: function () {
                textureManager.drawTexture("hi", 0, 0, this.sWidth, this.sHeight,
                    this.position.x, this.position.y, this.dWidth, this.dHeight);
            }
        };

        this.charList = gameJson["MenuState"]["characters"];
        this.charPointer = 0;
        this.hiddenChars = 1;

        this.playerInitData = gameJson["PlayState"]["objects"][1];
        this.updatePlayerInitData();
    }

    switchChar() {
        // mouse
        if (inputHandler.mouseLeftPressed) {
            if (collisionManager.mouseButtonCollision(inputHandler.mEvent, this.selectorBox)) {
                var canvasPosX = (window.innerWidth - canvas.width) / 2;
                var x1 = inputHandler.mEvent.clientX - canvasPosX;
                var x2 = this.selectorBox.width / 2 * canvasScaler;
                
                if (x1 > x2) {
                    this.charPointer = (++this.charPointer) % (this.charList.length - this.hiddenChars);
                    this.selectorBox.skipRightArrowDraw = true;
                    this.selectorBox.t1 = frameStartTime;
                } else {
                    this.charPointer = mod(--this.charPointer, (this.charList.length - this.hiddenChars));
                    this.selectorBox.skipLeftArrowDraw = true;
                    this.selectorBox.t1 = frameStartTime;
                }
                this.updatePlayerInitData();
            }

            // reset mouse
            inputHandler.mouseLeftPressed = false;
        }
    }

    updatePlayerInitData() {
        this.playerInitData.position = this.charList[this.charPointer].position;
        this.playerInitData.textureID = this.charList[this.charPointer].textureID;
        this.playerInitData.sWidth = this.charList[this.charPointer].sWidth;
        this.playerInitData.sHeight = this.charList[this.charPointer].sHeight;
        this.playerInitData.dWidth = this.charList[this.charPointer].dWidth;
        this.playerInitData.dHeight = this.charList[this.charPointer].dHeight;
        this.playerInitData.currentFrame = this.charList[this.charPointer].currentFrame;
        this.playerInitData.currentRow = this.charList[this.charPointer].currentRow;
        this.playerInitData.numFrames = this.charList[this.charPointer].numFrames;
        this.playerInitData.animSpeed = this.charList[this.charPointer].animSpeed;
        this.playerInitData.collisionCircle = this.charList[this.charPointer].collisionCircle;

        this.charBox.updateCharBox();
    }

    update() {
        this.switchChar();
    }

    draw() {
        this.hi.drawHi();
        this.charBox.drawChar();
        this.selectorBox.drawLeftArrow();
        this.selectorBox.drawRightArrow();
    }
  
}