'use strict'

class GameoverState extends GameState {
    constructor() {
        super();

        this.textBox = new TextBox();
        this.playState = null; // PlayState reference
        this.playStateScore = 0;
        this.playStateTime = 0;

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

        // get PlayState score and time played
        this.playState = gameStateMachine.stack[1];
        this.playStateScore = this.playState.scoreObject.formattedScore;
        this.playStateTime = this.playState.timerObject.totalTimePassed;

        // pass PlayState unformatted score and time to MenuState
        gameStateMachine.stack[0].updateTopScore(this.playState.scoreObject.score, this.playStateTime);
        
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
        this.textBox = new TextBox();
        this.playState = null;
        this.playStateScore = 0;
        this.playStateTime = 0;
    }

    //call back functions
    switchToMenuState() {
        gameStateMachine.requestStackPop(); // GameoverState
        gameStateMachine.requestStackPop(); // PlayState
    }

}