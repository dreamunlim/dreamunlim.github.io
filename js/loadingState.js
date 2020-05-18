'use strict'

class LoadingState extends GameState {
    constructor() {
        super();

        this.totalAssets = 0;
    }

    update() {
        this.level.update();

        if ((textureManager.textureMap.size + soundManager.soundMap.size) == this.totalAssets) {
            this.switchToPlayState();
        }
    }

    draw() {
        this.level.draw();

        document.fonts.ready.then(_ => {
            drawText("Loading Assets", width / 2, height / 2, "68px Bebas Neue", "center", "purple");
            drawText("Loading Assets", width / 2, height / 2, "65px Bebas Neue", "center", "mediumpurple");
        });
    }

    onEnter() {
        levelParser.parseLevel(this);

        return true;
    }

    onExit() {

        return true;
    }

    //call back functions
    switchToPlayState() {
        gameStateMachine.requestStackChange(StateID.Play);
    }

}