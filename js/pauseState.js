'use strict'

class PauseState extends GameState {
    constructor() {
        super();

        // PlayState stack index
        this.PlayState = 1; 

        // fuction pointers
        this.funcPointersMap = {
            "II": this.switchToPlayState
        };
    }

    update() {
        gameStateMachine.stack[this.PlayState].pauseButton.updateObject();

        // keyboard
        // avoid two stack pops in a row  
        if (inputHandler.escPressed && !gameStateMachine.pendingList.length) {
            inputHandler.escPressed = false;
            this.switchToPlayState();
        }
    }

    draw() {
        gameStateMachine.stack[this.PlayState].pauseButton.drawObject();
    }

    onEnter() {
        levelParser.parseLevel(this);

        // take Pause button ownership from PlayState
        gameStateMachine.stack[this.PlayState].pauseButton.state = this;

        return true;
    }

    onExit() {
        // return Pause button ownership to PlayState
        gameStateMachine.stack[this.PlayState].pauseButton.state = gameStateMachine.stack[this.PlayState];

        return true;
    }

    //call back functions
    switchToPlayState() {
        gameStateMachine.requestStackPop();
    }

}