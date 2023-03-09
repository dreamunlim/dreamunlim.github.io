import { gameStateMachine } from "./gameStateMachine.js";

class Info {
    constructor (initData) {
        // object owner
        this.state = gameStateMachine.stack[gameStateMachine.stack.length - 1];

        this.position = initData.position;
        this.font = initData.font;
        this.fontColour = initData.fontColour;
        this.fontShadowColour = initData.fontShadowColour;

        if (initData.fontShadow) {
            this.fontShadow = initData.fontShadow;
        }
    }
}

export { Info };