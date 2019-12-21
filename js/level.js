'use strict'

class Level {
    constructor() {
        // this.tilesets = new Array();
        this.layers = new Array();
    }

    update() {
        // loop through layers
        for (var i = 0; i != this.layers.length; ++i) {
            // loop through objects
            var currLayer = this.layers[i];
            for (var j = 0; j != currLayer.length; ++j) {
                currLayer[j].updateObject();
            }
        }
    }

    draw() {
        // loop through layers
        for (var i = 0; i != this.layers.length; ++i) {
            // loop through objects
            var currLayer = this.layers[i];
            for (var j = 0; j != currLayer.length; ++j) {
                currLayer[j].drawObject();
            }
        }
    }
}