'use strict'

class PauseState extends GameState {
    constructor() {
        super();

        this.pauseStartTime = 0;
        this.playState = null;
        
        // fuction pointers
        this.funcPointersMap = {
            "II": this.switchToPlayState
        };
    }

    update() {
        this.playState.pauseButton.updateObject();

        // keyboard
        if (inputHandler.escPressed) {
            inputHandler.escPressed = false;
            this.switchToPlayState();
        }
    }

    draw() {
        this.playState.pauseButton.drawObject();
    }

    onEnter() {
        this.pauseStartTime = frameStartTime;
        
        this.playState = gameStateMachine.stack[1];

        // take Pause button ownership from PlayState
        this.playState.pauseButton.state = this;

        levelParser.parseLevel(this);

        return true;
    }

    onExit() {
        var pauseDuration = frameStartTime - this.pauseStartTime;

        // correct PlayState time counters
        this.playState.timerObject.actionStartTime += pauseDuration;
        this.playState.timerObject.boosterPickUpTime += pauseDuration;

        // return Pause button ownership to PlayState
        this.playState.pauseButton.state = this.playState;

        this.clean();

        return true;
    }

    clean() {
        // delete old object layers
        this.level.layers = new Array();

        // reset
        this.pauseStartTime = 0;
        this.playState = null;
    }

    //call back functions
    switchToPlayState() {
        // avoid two stack pops in a row
        if (! gameStateMachine.pendingList.length) {
            gameStateMachine.requestStackPop();
        }
    }

}