import { Player } from "./player.js";
import { Booster } from "./booster.js";
import { Heart } from "./heart.js";
import { Spider } from "./spider.js";
import { Button } from "./button.js";
import { PlayBackground } from "./playBackground.js";
import { Background } from "./background.js";
import { Counter } from "./counter.js";
import { Star } from "./star.js";
import { Diamond } from "./diamond.js";

class GameObjectFactory {
    constructor() {
        this.objectFactory = new Map();
    }

    registerObject(id, type) {
        // if type already exists
        if(this.objectFactory.has(id)) {
            return;
        }

        this.objectFactory.set(id, type);
    }

    createObject(id) {
        // if type does not exist
        if(! this.objectFactory.has(id)) {
            throw new Error("Object not in factory");
        }

        return this.objectFactory.get(id);
    }
}

const gameObjectFactory = new GameObjectFactory();

gameObjectFactory.registerObject("player", Player);
gameObjectFactory.registerObject("booster", Booster);
gameObjectFactory.registerObject("heart", Heart);
gameObjectFactory.registerObject("spider", Spider);
gameObjectFactory.registerObject("button", Button);
gameObjectFactory.registerObject("play-background", PlayBackground);
gameObjectFactory.registerObject("background", Background);
gameObjectFactory.registerObject("counter", Counter);
gameObjectFactory.registerObject("star", Star);
gameObjectFactory.registerObject("diamond", Diamond);

export { gameObjectFactory };