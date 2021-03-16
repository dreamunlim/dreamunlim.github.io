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
        clearCanvas(0, 0, width, height);
        
        if(document.fonts.size) {
            drawText("Loading Assets", width / 2, height / 2, "68px Bebas Neue", "center", "purple", "middle");
            drawText("Loading Assets", width / 2, height / 2, "65px Bebas Neue", "center", "mediumpurple", "middle");
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