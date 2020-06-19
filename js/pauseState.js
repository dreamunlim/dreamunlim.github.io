'use strict'

class PauseState extends GameState {
    constructor() {
        super();

        this.pauseStartTime = 0;
        this.playState = null; // PlayState reference
        
        // fuction pointers
        this.funcPointersMap = {
            "II": this.switchToPlayState
        };
    }

    update() {
        this.playState.pauseButton.updateObject();

        // keyboard
        // avoid two stack pops in a row  
        if (inputHandler.escPressed && !gameStateMachine.pendingList.length) {
            inputHandler.escPressed = false;
            this.switchToPlayState();
        }
    }

    draw() {
        this.playState.pauseButton.drawObject();
    }

    onEnter() {
        this.pauseStartTime = time;
        
        this.playState = gameStateMachine.stack[1];

        // take Pause button ownership from PlayState
        this.playState.pauseButton.state = this;

        levelParser.parseLevel(this);

        return true;
    }

    onExit() {
        var pauseDuration = time - this.pauseStartTime;

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
        gameStateMachine.requestStackPop();
    }

}