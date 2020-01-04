'use strict'

class PlayState extends GameState {
    constructor() {
        super();

        this.lanes;
    }

    update() {
        this.level.update();
    }

    draw() {
        this.level.draw();
    }

    onEnter() {
        // console.log(gameJson);
        levelParser.parseLevel(this);

        return true;
    }

    onExit() {

        return true;
    }

    //call back functions
    switchToPause() {

    }

    switchToGameOver() {

    }

}