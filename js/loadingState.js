'use strict'

class LoadingState extends GameState {
    constructor() {
        super();

        this.totalAssets = 0;
    }

    update() {
        if ((document.fonts.size + textureManager.textureMap.size + soundManager.soundMap.size) == this.totalAssets) {
            this.switchToMenuState();
        }
    }

    draw() {
        clearCanvas();
        
        if(document.fonts.size) {
            drawText("Loading Assets", width / 2 / scale, height / 2 / scale, "68px Bebas Neue", "center", "purple", "alphabetic");
            drawText("Loading Assets", width / 2 / scale, height / 2 / scale, "65px Bebas Neue", "center", "mediumpurple", "alphabetic");
        }
    }

    onEnter() {
        const fonts = gameJson["LoadingState"]["fonts"];
        const textures = gameJson["LoadingState"]["textures"];
        const sounds = gameJson["LoadingState"]["sounds"];

        this.totalAssets = fonts.length + textures.length + sounds.length;

        levelParser.parseLevel(this);

        return true;
    }

    onExit() {

        return true;
    }

    //call back functions
    switchToMenuState() {
        gameStateMachine.requestStackChange(StateID.Menu);
    }

}