import { LoadingState } from "./loadingState.js";
import { MenuState } from "./menuState.js";
import { PlayState } from "./playState.js";
import { PauseState } from "./pauseState.js";
import { GameoverState } from "./gameoverState.js";

// enums
const Action = Object.freeze({"Push": 0, "Pop": 1, "Change": 2});
const StateID = Object.freeze({"Loading": 0, "Menu": 1, "Play": 2, "Pause": 3, "Gameover": 4});

class PendingChange {
    constructor(action, stateID) {
        this.action = action;
        this.stateID = stateID;
    }
}

class GameStateMachine {
    constructor() {
        this.stack = new Array();
        this.stateFactory = new Map();
        this.pendingList = new Array();
    }

    // factory actions
    registerState(id, type) {
        // if type already exists
        if (this.stateFactory.has(id)) {
            return;
        }

        this.stateFactory.set(id, type);
    }

    createState(id) {
        // if type does not exist
        if (! this.stateFactory.has(id)) {
            throw new Error("Game state not in factory");
        }

        return this.stateFactory.get(id);
    }

    // stack actions
    pushState(state) {
        this.stack.push(state);
        this.stack[this.stack.length - 1].onEnter();
    }

    popState() {
        if (this.stack.length) {
            if (this.stack[this.stack.length - 1].onExit()) {
                this.stack.pop();
            }
        }
    }

    //remove all and add a state
    changeState(state) {
        //empty the stack
        while (this.stack.length) {
            if (this.stack[this.stack.length - 1].onExit()) {
                this.stack.pop();
            }
        }

        //add new state
        this.stack.push(state);
        this.stack[this.stack.length - 1].onEnter();
    }

    // state machine actions
    updateCurrentState() {
        if (this.pendingList.length) {
            this.applyPendingChanges();
        }

        if (this.stack.length) {
            this.stack[this.stack.length - 1].update();
        }
    }

    drawCurrentState() {
        if (this.stack.length) {
            this.stack[this.stack.length - 1].draw();
        }
    }

    // pending list actions
    requestStackPush(stateID) {
        this.pendingList.push(new PendingChange(Action.Push, stateID));
    }

    requestStackPop() {
        this.pendingList.push(new PendingChange(Action.Pop));
    }

    requestStackChange(stateID) {
        this.pendingList.push(new PendingChange(Action.Change, stateID));
    }

    applyPendingChanges() {
        for (var i = 0; i != this.pendingList.length; ++i) {
            var pendingChange = this.pendingList[i];

            switch (pendingChange.action) {
                case Action.Push:
                    this.pushState(this.createState(pendingChange.stateID));
                    break;

                case Action.Pop:
                    this.popState();
                    break;

                case Action.Change:
                    this.changeState(this.createState(pendingChange.stateID));
                    break;
            }
        }

        //clear the list
        while (this.pendingList.length) {
            this.pendingList.pop();
        }
    }
}

const gameStateMachine = new GameStateMachine();

// finite state machine states
gameStateMachine.registerState(StateID.Loading, new LoadingState());
gameStateMachine.registerState(StateID.Menu, new MenuState());
gameStateMachine.registerState(StateID.Play, new PlayState());
gameStateMachine.registerState(StateID.Pause, new PauseState());
gameStateMachine.registerState(StateID.Gameover, new GameoverState());
gameStateMachine.requestStackPush(StateID.Loading);

export { gameStateMachine, StateID };