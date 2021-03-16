'use strict'

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

        this.textBox.alignOkButton(this.okButton);
    }

    update() {
        this.okButton.updateObject();
    }

    draw() {
        clearCanvas(0, 0, width, height, "rgba(122,138,161, 0.5)");
        this.textBox.drawTextBox();
        this.okButton.drawObject();
    }

}

class MenuState extends GameState {
    constructor() {
        super();

        this.gameTitle = "Dreamer Unlimited";

        this.titleFont = "68px Bebas Neue";
        this.scoreFont = "35px Orbitron";

        this.consentPopup = null;
        this.consentGranted = false; // Terms of Use and Privacy Policy

        this.topScore = [[0,0], [0,0], [0,0]]; // score-time pairs

        this.overridePicture = new OverridePicture();
        this.shareScoreObj = new ShareScore();
        this.characterUnlocker = new CharacterUnlocker();
        this.characterSelector = null;

        this.localStorageAvailable = storageAvailable("localStorage");

        // fuction pointers
        this.funcPointersMap = {
            "Play": this.switchToPlayState,
            "Share Score": this.shareScore,
            "Override Pic": this.overridePic,
            "Help": this.redirectToAbout,
            "OK": this.removeConsentPopup
        };
    }

    update() {
        // update popup until consent granted
        if (! this.consentGranted) {
            this.consentPopup.update();
            return;
        }

        this.level.update();
        
        this.characterUnlocker.update();
        this.characterSelector.update();
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

    drawTitle () {
        var x = 20;
        var y = 0;
        drawText(this.gameTitle, x + 2, y + 2, this.titleFont, "start", "black");
        drawText(this.gameTitle, x, y, this.titleFont, "start", "mediumpurple");
    }

    drawTopScore () {
        var x = 20;
        var y = 420;
        var spacing = 35;
        var charWidth = ctx.measureText("A").width;
        
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "coral";
        
        drawText("TOP SCORE", x, y, this.scoreFont, "start", "darkgoldenrod");

        for (var i = 0; i != this.topScore.length; ++i) {
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
        var y = height;
        drawText("©2020 STANTAL", x, y, "30px Bebas Neue", "start", "rgba(128,0,0, 0.8)", "bottom");
    }

    cacheDataToLocalStorage() {
        if (this.localStorageAvailable) {
            var data = {
                topScore: this.topScore,
                fbShareData: this.shareScoreObj.dataToShare,
                selectedChar: this.characterSelector.charPointer,
                hiddenChars: this.characterSelector.hiddenChars,
                charUnlocked: this.characterUnlocker.charUnlocked,
                consentGranted: this.consentGranted,
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
        }
        
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
        // "this" points to "funcPointersMap" from here
        // can't do "this.topScore[0] === 0"

        button.state.shareScoreObj.shareScoreButton = button; // to relay hint messages
        button.state.shareScoreObj.input.click();
    }

    overridePic(button) {
        button.state.overridePicture.overridePicButton = button; // to relay hint messages
        button.state.overridePicture.input.click();
    }

    redirectToAbout(button) {
        if(button.state.topScore[0][0] === 0) {
            window.open(button.url, "_self");
        } else {
            window.open(button.url, "_blank"); // avoid losing score
        }
    }

    removeConsentPopup(button) {
        button.state.consentGranted = true;
        button.state.consentPopup = null;
        button.state.cacheDataToLocalStorage();
    }

}