import { GameState } from "./gameState.js";
import { mod } from "./auxiliary.js";
import { canvas } from "./canvas.js";
import { frameStartTime } from "./main.js";
import { TextBox } from "./textBox.js";
import { levelParser } from "./levelParser.js";
import { inputHandler } from "./inputHandler.js";
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
            formattedSeconds: 0,
            canvasScreenshot: null,
            alreadyPosted: false
        };

        this.buttonsArray = null;
        this.selectedButton = 0;
        this.keyboardEventsDelay = 400; // in ms

        // fuction pointers
        this.funcPointersMap = {
            "OK": this.switchToMenuState,
            "Revive": this.popGameoverState
        };
    }

    handleKeyboardInput() {
        if (this.delayKeyboardEvents()) {
            return;
        }

        if (inputHandler.enterPressed && !inputHandler.keyEvent.repeat) {
            inputHandler.enterPressed = false;
            this.buttonsArray[this.selectedButton].handleClick();

        } else if (inputHandler.leftPressed) {
            inputHandler.leftPressed = false;
            this.buttonsArray[this.selectedButton].removeHighlight();
            this.selectedButton = mod(--this.selectedButton, this.buttonsArray.length);
            this.buttonsArray[this.selectedButton].doAnimatedHighlight();

        } else if (inputHandler.rightPressed) {
            inputHandler.rightPressed = false;
            this.buttonsArray[this.selectedButton].removeHighlight();
            this.selectedButton = (++this.selectedButton) % this.buttonsArray.length;
            this.buttonsArray[this.selectedButton].doAnimatedHighlight();
        }
    }

    delayKeyboardEvents() {
        if ((frameStartTime - this.gameoverStartTime) > this.keyboardEventsDelay) {
            return false;
        }
        return true;
    }

    redefineSelectedButton() {
        if (this.playState.timerObject.timerCurrentValue > 0 &&
            this.playState.playerObject.lives > 0) {
            this.selectedButton = 1;
        } else {
            this.selectedButton = 0;
        }
    }

    highlightSelectedButton() {
        if (inputHandler.keyEvent) {
            this.buttonsArray[this.selectedButton].doPlainHighlight();
        }
    }

    update() {
        this.level.update();

        this.handleKeyboardInput();
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

        this.redefineSelectedButton();
        this.highlightSelectedButton();

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
        this.buttonsArray = null;
    }

    //call back functions
    switchToMenuState(button) {
        const gameoverState = button.state;

        // pass FB share data to MenuState shareScore object
        if (gameoverState.playState.scoreObject.score > gameoverState.menuState.topScore[0][0]) {
            gameoverState.dataToShare.alreadyPosted = false;
            gameoverState.dataToShare.canvasScreenshot = canvas.toDataURL("image/jpeg", 0.95);
            gameoverState.menuState.shareScoreObj.dataToShare = gameoverState.dataToShare;
        }

        // pass PlayState unformatted score and time to MenuState
        gameoverState.menuState.updateTopScore(gameoverState.playState.scoreObject.score, button.state.playState.timerObject.totalTimePassed);

        // cache top score, selected char and FB share data
        gameoverState.menuState.cacheDataToLocalStorage();

        gameStateMachine.requestStackPop(); // GameoverState
        gameStateMachine.requestStackPop(); // PlayState
    }

    popGameoverState(button) {
        const gameoverState = button.state;

        gameoverState.playState.playerObject.lives -= 1;
        gameoverState.playState.playerObject.revive = true;
        gameStateMachine.requestStackPop();
    }
}

export { GameoverState };