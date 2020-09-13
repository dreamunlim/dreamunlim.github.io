'use strict'

class CharacterUnlocker {
    constructor() {
        this.squares = [
            {
                width: width / 2, height: height / 2,
                position: {x: 0, y: 0}
            },
            {
                width: width / 2, height: height / 2,
                position: {x: width / 2, y: 0}
            },
            {
                width: width / 2, height: height / 2,
                position: {x: 0, y: height / 2}
            },
            {
                width: width / 2, height: height / 2,
                position: {x: width / 2, y: height / 2}
            }
        ];

        this.unlockPattern = [0, 1, 2, 3, 0, 3];
        this.currentPattern = [];
        this.patternResetPeriod = 2500; // in ms
        this.charUnlocked = false;
        this.timerStarted = false;
        this.t1 = 0;
    }

    update() {
        if (this.charUnlocked) {
            return;
        }

        // check collision with squares
        if (inputHandler.mouseLeftPressed) {
            for (var i = 0; i < this.squares.length; ++i) {
                if (collisionManager.mouseButtonCollision(inputHandler.mEvent, this.squares[i])) {
                    this.currentPattern.push(i);
                }
            }

            // start timer
            if (! this.timerStarted) {
                this.timerStarted = true;
                this.t1 = time;
            }
        }

        // check pattern match
        if (this.currentPattern.length >= this.unlockPattern.length) {
            var matched = false;

            for (var i = 0; i < this.unlockPattern.length; ++i) {
                if (this.currentPattern[i] != this.unlockPattern[i]) {
                    matched = false;

                    //reset pattern
                    this.currentPattern = [];
                    this.timerStarted = false;
                    this.t1 = 0;

                    break;
                }
                matched = true;
            }

            if (matched) {
                this.charUnlocked = true;

                var menuState = gameStateMachine.stack[0];
                menuState.characterSelector.hiddenChars = 0;
                menuState.characterSelector.charPointer = menuState.characterSelector.charList.length - 1;
                menuState.characterSelector.updatePlayerInitData();
            }
        }

        // reset pattern on timeout
        if (this.timerStarted && ((time - this.t1) > this.patternResetPeriod)) {
            this.currentPattern = [];
            this.timerStarted = false;
            this.t1 = 0;
        }
    }

}