'use strict'

class PlayState extends GameState {
    constructor() {
        super();

        this.lanes = [-114, 14, 142, 270, 398, 526, 654];
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