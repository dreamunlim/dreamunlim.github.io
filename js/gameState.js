import { Level } from "./level.js";

class GameState {
    constructor() {
        this.level = new Level(); // current game level
    }
}

export { GameState };