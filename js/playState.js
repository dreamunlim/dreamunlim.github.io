'use strict'

class PlayState extends GameState {
    constructor() {
        super();

        this.lanes = [-114, 14, 142, 270, 398, 526, 654, 782, 910];

        this.spiderBusyLanes = [null, 0, 0, 0, 0, 0, 0, 0, null]; // 1 and 0 flags 

        this.playerObject = null; // to be visible to Enemies
        this.pauseButton = null; // to be visible to Player, Pause state
        this.scoreObject = null; // to be visible to Enemies
        this.timerObject = null; // to be visible to Booster, Pause state
        this.boosterObject = null; // to be visible to Timer, Spider

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
        inputHandler.resetInputStates();

        levelParser.parseLevel(this);

        return true;
    }

    onExit() {
        this.clean();

        return true;
    }

    clean() {
        // delete old object layers, since:
        // 1) was causing instant player-spider collision on game restart
        // 2) new layers stacked onto old ones
        this.level.layers = new Array();
        
        // reset
        this.spiderBusyLanes = [null, 0, 0, 0, 0, 0, 0, 0, null];
        this.playerObject = null;
        this.pauseButton = null;
        this.scoreObject = null;
        this.timerObject = null;
        this.boosterObject = null;
    }

    //call back functions
    switchToPauseState() {
        gameStateMachine.requestStackPush(StateID.Pause);
    }

    switchToGameOverState() {
        gameStateMachine.requestStackPush(StateID.Gameover);
    }

}