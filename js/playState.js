'use strict'

class PlayState extends GameState {
    constructor() {
        super();
    }

    update() {
        this.level.update();
    }

    draw() {
        this.level.draw();
    }

    onEnter() {
        // console.log(gameJson);
        levelParser.parseLevel(this.level);

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