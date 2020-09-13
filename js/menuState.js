'use strict'

class MenuState extends GameState {
    constructor() {
        super();

        this.topScore = [[0,0], [0,0], [0,0]]; // score-time pairs

        this.gameTitle = "Dreamer Unlimited";

        this.titleFont = "68px Bebas Neue";
        this.scoreFont = "35px Orbitron";

        this.overridePicture = new OverridePicture();
        this.shareScoreObj = new ShareScore();
        this.characterUnlocker = new CharacterUnlocker();
        this.characterSelector = null;

        // fuction pointers
        this.funcPointersMap = {
            "Play": this.switchToPlayState,
            "Share Score": this.shareScore,
            "Override Pic": this.overridePic,
            "How To": this.redirectToAbout
        };
    }

    update() {
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
        var data = {
            topScore: this.topScore,
            fbShareData: this.shareScoreObj.dataToShare,
            selectedChar: this.characterSelector.charPointer,
            hiddenChars: this.characterSelector.hiddenChars,
            charUnlocked: this.characterUnlocker.charUnlocked
        };

        localStorage.setItem("data", JSON.stringify(data));
    }

    onEnter() {
        this.characterSelector = new CharacterSelector();
        
        onStorageChange(); // load cached data
        
        levelParser.parseLevel(this);

        return true;
    }

    onExit() {

        return true;
    }

    //call back functions
    switchToPlayState() {
        gameStateMachine.requestStackPush(StateID.Play);
    }

    shareScore(button) {
        // "this" points to "funcPointersMap" from here
        // can't do "this.topScore[0] === 0"
        
        if(button.state.topScore[0][0] === 0) {
            button.hintMessage = "Zero Score";
            return;
        }

        button.state.shareScoreObj.input.click();
        button.state.shareScoreObj.shareScoreButton = button; // to relay hint messages
    }

    overridePic(button) {
        button.state.overridePicture.input.click();
        button.state.overridePicture.overridePicButton = button; // to relay hint messages
    }

    redirectToAbout(button) {
        if(button.state.topScore[0][0] === 0) {
            window.open(button.url, "_self");
        } else {
            window.open(button.url, "_blank"); // avoid losing score
        }
    }

}