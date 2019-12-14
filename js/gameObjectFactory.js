'use strict'

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
