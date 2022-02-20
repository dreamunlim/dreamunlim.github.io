import { GameState } from "./gameState.js";
import { frameStartTime } from "./main.js";
import { TextBox } from "./textBox.js";
import { levelParser } from "./levelParser.js";
import { gameStateMachine } from "./gameStateMachine.js";

class GameoverState extends GameState {
    constructor() {
        super();

        this.gameoverStartTime = 0;
        this.textBox = new TextBox(this);
        this.menuState = null;
        this.playState = null;

        // FB share data
        this.dataToShare = {
            formattedScore: 0,
            formattedMinutes: 0,
            formattedSeconds: 0
        };

        // fuction pointers
        this.funcPointersMap = {
            "OK": this.switchToMenuState,
            "Revive": this.popGameoverState
        };
    }

    update() {
        this.level.update();
    }

    draw() {
        this.textBox.drawTextBox();

        this.level.draw();
    }

    onEnter() {
        this.gameoverStartTime = frameStartTime;

        levelParser.parseLevel(this);

        this.menuState = gameStateMachine.stack[0];
        this.playState = gameStateMachine.stack[1];

        // stash FB share data
        this.dataToShare.formattedScore = this.playState.scoreObject.formattedScore;
        this.dataToShare.formattedMinutes = Math.floor(this.playState.timerObject.totalTimePassed / 1000 / 60);
        this.dataToShare.formattedSeconds = Math.floor(this.playState.timerObject.totalTimePassed / 1000 % 60);

        // pass FB share data to MenuState shareScore object
        if (this.playState.scoreObject.score > this.menuState.topScore[0][0]) {
            this.menuState.shareScoreObj.dataToShare = this.dataToShare;
        }
        
        return true;
    }

    onExit() {
        var gameoverDuration = frameStartTime - this.gameoverStartTime;

        // correct PlayState time counters to account for pause before player revive
        this.playState.timerObject.actionStartTime += gameoverDuration;
        this.playState.timerObject.boosterPickUpTime += gameoverDuration;

        this.clean();

        return true;
    }

    clean() {
        // delete old object layers
        this.level.layers = new Array();

        // reset
        this.gameoverStartTime = 0;
        this.textBox = new TextBox(this);
        this.menuState = null;
        this.playState = null;
        this.dataToShare = {};
    }

    //call back functions
    switchToMenuState(button) {
        // pass PlayState unformatted score and time to MenuState
        button.state.menuState.updateTopScore(button.state.playState.scoreObject.score, button.state.playState.timerObject.totalTimePassed);

        // cache top score, selected char and FB share data
        button.state.menuState.cacheDataToLocalStorage();

        gameStateMachine.requestStackPop(); // GameoverState
        gameStateMachine.requestStackPop(); // PlayState
    }

    popGameoverState(button) {
        button.state.playState.playerObject.lives -= 1;
        button.state.playState.playerObject.revive = true;
        gameStateMachine.requestStackPop();
    }
}

export { GameoverState };