'use strict'

class PauseState extends GameState {
    constructor() {
        super();

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
        
        // PlayState reference
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

        return true;
    }

    //call back functions
    switchToPlayState() {
        gameStateMachine.requestStackPop();
    }

}