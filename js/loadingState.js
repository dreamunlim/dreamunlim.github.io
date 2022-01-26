import { GameState } from "./gameState.js";
import { gameJson } from "./main.js";
import { drawText } from "./auxiliary.js";
import { canvasInitialHeight, canvasInitialWidth, clearCanvas } from "./canvas.js";
import { levelParser } from "./levelParser.js";
import { soundManager } from "./soundManager.js";
import { textureManager } from "./textureManager.js";
import { gameStateMachine, StateID } from "./gameStateMachine.js";

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
        clearCanvas(0, 0, canvasInitialWidth, canvasInitialHeight);
        
        if(document.fonts.size) {
            drawText("Loading Assets", canvasInitialWidth / 2, canvasInitialHeight / 2, "68px Bebas Neue", "center", "purple", "middle");
            drawText("Loading Assets", canvasInitialWidth / 2, canvasInitialHeight / 2, "65px Bebas Neue", "center", "mediumpurple", "middle");
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

export { LoadingState };