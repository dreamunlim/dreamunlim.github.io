import { GameState } from "./gameState.js";
import { ctx, canvasInitialHeight, canvasInitialWidth, clearCanvas } from "./canvas.js";
import { mod, storageAvailable, onStorageChange, registerServiceWorker, drawText, insertionSort } from "./auxiliary.js";
import { TextBox } from "./textBox.js";
import { ShareScore } from "./shareScore.js";
import { OverridePicture } from "./overridePicture.js";
import { CharacterUnlocker } from "./characterUnlocker.js";
import { CharacterSelector } from "./characterSelector.js";
import { levelParser } from "./levelParser.js";
import { inputHandler } from "./inputHandler.js";
import { gameObjectFactory } from "./gameObjectFactory.js";
import { gameStateMachine, StateID } from "./gameStateMachine.js";

class ConsentPopup {
    constructor(state) {
        this.textBox = new TextBox(state);

        this.okButtonInitData = {
            text: "OK",
            pos: {x: 320, y: 320},
            width: 80,
            height: 80
        }

        this.okButton = new (gameObjectFactory.createObject("button"))(this.okButtonInitData);
        this.textBox.alignButton(this.okButton);
    }

    update() {
        this.okButton.updateObject();

        // keyboard
        if (inputHandler.enterPressed && !inputHandler.keyEvent.repeat) {
            inputHandler.enterPressed = false;
            this.okButton.handleClick();
        }
    }

    draw() {
        clearCanvas(0, 0, canvasInitialWidth, canvasInitialHeight, "rgba(3,149,149, 0.5)");
        this.textBox.drawTextBox();
        this.okButton.drawObject();
    }

}

class MenuState extends GameState {
    constructor() {
        super();

        this.gameTitle = "Dreamer Unlimited".toUpperCase();

        this.titleFont = "67px Coiny";
        this.scoreFont = "37px Orbitron";

        this.reloadGame = false;

        this.consentPopup = null;
        this.consentGranted = false; // Terms of Use and Privacy Policy

        this.topScore = [[0,0], [0,0], [0,0]]; // score-time pairs

        this.overridePicture = new OverridePicture();
        this.shareScoreObj = new ShareScore();
        this.characterUnlocker = new CharacterUnlocker();
        this.characterSelector = null;

        this.localStorageAvailable = storageAvailable("localStorage");

        this.buttonsArray = null;
        this.selectedButton = 0;

        // fuction pointers
        this.funcPointersMap = {
            "Play": this.switchToPlayState,
            "Share Score": this.shareScore,
            "Override Pic": this.overridePic,
            "Help": this.redirectToAbout,
            "OK": this.removeConsentPopup
        };
    }

    handleKeyboardInput() {
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

        } else if (inputHandler.upPressed) {
            inputHandler.upPressed = false;
            this.characterSelector.selectPreviousChar();

        } else if (inputHandler.downPressed) {
            inputHandler.downPressed = false;
            this.characterSelector.selectNextChar();
        }
    }

    highlightSelectedButton() {
        if (inputHandler.keyEvent) {
            this.buttonsArray[this.selectedButton].doPlainHighlight();
        }
    }

    update() {
        if (this.reloadGame) {
            this.pushUpdatingState();
            this.reloadGame = false;
            return;
        }

        // update popup until consent granted
        if (! this.consentGranted) {
            this.consentPopup.update();
            return;
        }

        this.level.update();
        
        this.characterUnlocker.update();
        this.characterSelector.update();

        this.handleKeyboardInput();
    }

    draw() {
        this.level.draw();

        this.characterSelector.draw();

        this.drawTitle();
        this.drawTopScore();
        this.drawAuthor();

        // draw popup until consent granted
        if (! this.consentGranted) {
            this.consentPopup.draw();
        }
    }

    drawTitle() {
        let x = 20;
        let y = 0;
        let width = canvasInitialWidth * 0.65;
        drawText(this.gameTitle, x + 2, y + 2, this.titleFont, "start", "black", "top", width);
        drawText(this.gameTitle, x, y, this.titleFont, "start", "mediumpurple", "top", width);
    }

    drawTopScore() {
        let x = 20;
        let y = 420;
        let spacing = 38;

        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "coral";
        
        drawText("TOP SCORE", x, y, this.scoreFont, "start", "darkgoldenrod");
        let charWidth = ctx.measureText("TO").width / 2;

        for (let i = 0; i != this.topScore.length; ++i) {
            y = y + spacing;
            drawText((i+1), x + charWidth, y, this.scoreFont, "right", "darkgoldenrod");
            drawText(this.topScore[i][0], x + charWidth * 2, y, this.scoreFont, "start", "darkgoldenrod");
        }

        // turn off shadow
        ctx.shadowColor = "rgba(0,0,0,0)";
    }

    updateTopScore(score, time) {
        this.topScore.push([score, time]);
        insertionSort(this.topScore);
        this.topScore.pop(); // limit array length to three pairs
    }

    drawAuthor () {
        var x = 20;
        var y = canvasInitialHeight;
        drawText("©2020 STANTAL", x, y, "30px Bebas Neue", "start", "rgba(128,0,0, 0.8)", "bottom");
    }

    cacheDataToLocalStorage() {
        if (this.localStorageAvailable) {
            let data = {
                topScore: this.topScore,
                fbShareData: this.shareScoreObj.dataToShare,
                selectedChar: this.characterSelector.charPointer,
                hiddenChars: this.characterSelector.hiddenChars,
                charUnlocked: this.characterUnlocker.charUnlocked,
                consentGranted: this.consentGranted,
                keyboardUsed: !!inputHandler.keyEvent
            };

            localStorage.setItem("data", JSON.stringify(data));
        }
    }

    onEnter() {
        this.characterSelector = new CharacterSelector();
        
        onStorageChange(); // load cached data
        
        levelParser.parseLevel(this);

        // create consent popup
        if (! this.consentGranted) {
            this.consentPopup = new ConsentPopup(this);
        } else {
            this.highlightSelectedButton();
        }
        
        // by this time the browser will have fetched all resources
        // enabling SW to populate own cache from disk cache firstly
        registerServiceWorker();
        
        return true;
    }

    onExit() {

        return true;
    }

    //call back functions
    switchToPlayState(button) {
        gameStateMachine.requestStackPush(StateID.Play);

        // log event
        gtag("event", "level_start", {
            "character_name": button.state.characterSelector.charBox.charName
        });
    }

    shareScore(button) {
        button.state.shareScoreObj.shareScoreButton = button; // to relay hint messages
        button.state.shareScoreObj.input.click();
    }

    overridePic(button) {
        button.state.overridePicture.overridePicButton = button; // to relay hint messages
        button.state.overridePicture.input.click();
    }

    redirectToAbout(button) {
        window.open(button.url, "_self");
    }

    removeConsentPopup(button) {
        button.state.consentGranted = true;
        button.state.consentPopup = null;
        button.state.highlightSelectedButton();
        button.state.cacheDataToLocalStorage();
    }

    pushUpdatingState() {
        gameStateMachine.requestStackPush(StateID.Updating);
    }
}

export { MenuState };