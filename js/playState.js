'use strict'

class PlayState extends GameState {
    constructor() {
        super();

        this.lanes = [-114, 14, 142, 270, 398, 526, 654];

        this.pauseButton = null; // to be visible to Player object, Pause state
        this.scoreObject = null; // to be visible to Player object
        this.timerObject = null; // to be visible to Booster, Pause state

        // fuction pointers
        this.funcPointersMap = {
            "II": this.switchToPauseState
        };
    }

    update() {
        this.level.update();

        // keyboard
        // avoid PauseState pushed second time in a row  
        if (inputHandler.escPressed && !gameStateMachine.pendingList.length) {
            inputHandler.escPressed = false;
            this.switchToPauseState();
        }
    }

    draw() {
        this.level.draw();
    }

    onEnter() {
        levelParser.parseLevel(this);

        return true;
    }

    onExit() {

        return true;
    }

    //call back functions
    switchToPauseState() {
        gameStateMachine.requestStackPush(StateID.Pause);
    }

    switchToGameOverState() {
        gameStateMachine.requestStackPush(StateID.Gameover);
    }

}