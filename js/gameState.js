import { Level } from "./level.js";
import { smartTV } from "./auxiliary.js";

class GameState {
    constructor() {
        this.level = new Level(); // current game level

        // host device identifier
        switch (this.constructor.name) {
            case "PlayState":
                this.smartTV = smartTV();
                break;
        }
    }
}

export { GameState };