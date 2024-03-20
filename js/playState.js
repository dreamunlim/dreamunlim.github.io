import { GameState } from "./gameState.js";
import { levelParser } from "./levelParser.js";
import { inputHandler } from "./inputHandler.js";
import { gameStateMachine, StateID } from "./gameStateMachine.js";

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
        this.pointsMultiplier = null; // to be visible to Enemies

        // fuction pointers
        this.funcPointersMap = {
            "II": this.switchToPauseState
        };
    }

    update() {
        this.level.update();

        // keyboard
        if ((inputHandler.enterPressed || inputHandler.escPressed) && !inputHandler.keyEvent.repeat) {
            inputHandler.escPressed = false;
            inputHandler.enterPressed = false;
            this.pauseButton.handleClick();
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
        // default html body colour
        document.body.className = "";
        
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
        this.pointsMultiplier = null;
        this.buttonsArray = null;
    }

    //call back functions
    switchToPauseState() {
        if (! gameStateMachine.pendingList.length) {
            gameStateMachine.requestStackPush(StateID.Pause);
        }
    }

    switchToGameOverState() {
        // avoid state pushed multiply times in a row
        if (! gameStateMachine.pendingList.length) {
            gameStateMachine.requestStackPush(StateID.Gameover);
        }
    }
}

export { PlayState };