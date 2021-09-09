'use strict'

class GameoverState extends GameState {
    constructor() {
        super();

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
            "OK": this.switchToMenuState
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
        levelParser.parseLevel(this);

        this.menuState = gameStateMachine.stack[0];
        this.playState = gameStateMachine.stack[1];

        // stash FB share data
        this.dataToShare.formattedScore = this.playState.scoreObject.formattedScore;
        this.dataToShare.formattedMinutes = Math.floor(this.playState.timerObject.totalTimePassed / 1000 / 60);
        this.dataToShare.formattedSeconds = Math.floor((this.playState.timerObject.totalTimePassed / 1000) % 60);

        // pass FB share data to MenuState shareScore object
        if (this.playState.scoreObject.score > this.menuState.topScore[0][0]) {
            this.menuState.shareScoreObj.dataToShare = this.dataToShare;
        }

        // pass PlayState unformatted score and time to MenuState
        this.menuState.updateTopScore(this.playState.scoreObject.score, this.playState.timerObject.totalTimePassed);
        
        // cache top score, selected char and FB share data
        this.menuState.cacheDataToLocalStorage();
        
        return true;
    }

    onExit() {
        this.clean();

        return true;
    }

    clean() {
        // delete old object layers
        this.level.layers = new Array();

        // reset
        this.textBox = new TextBox(this);
        this.menuState = null;
        this.playState = null;
        this.dataToShare = {};
    }

    //call back functions
    switchToMenuState() {
        gameStateMachine.requestStackPop(); // GameoverState
        gameStateMachine.requestStackPop(); // PlayState
    }

}