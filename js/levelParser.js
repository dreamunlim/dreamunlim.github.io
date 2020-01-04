'use strict'

var gameJson;

class LevelParser {
    // gameJson;

    constructor() {
        this.parseJson("json/initAll.json");

        this.stateID;
    }

    parseJson(jsonPath) {

        fetch(jsonPath)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                gameJson = json;
            })
            .catch(function (error) {
                console.error(error);
            });

        // var request = new XMLHttpRequest();

        // request.open('GET', jsonPath);
        // request.responseType = 'json';
        // request.send();

        // request.onload = function () {
        //     // could not store 'request.response' even in a global var  
        //     // would pass json further from here
        //     gameJson = request.response;
        // }
    }

    parseLevel(state) {
        this.stateID = state.constructor.name; // define the caller

        switch(this.stateID) {
            case "PlayState":
                state.lanes = gameJson[this.stateID]["lanes"];
        }
        
        this.parseObjectLayer(state.level);

        this.stateID = null;
    }

    // parseTilesets(pTilesetRoot) {}

    // parseTileLayer(pLayerRoot) {}
    
    // parseTextures(pTexturesRoot) {}

    parseObjectLayer(level) {
        var objectLayer = new Array(); // new ObjectLayer();

        this.parseObjects(objectLayer);

        // store current level objects layer
        level.layers.push(objectLayer);
    }

    parseObjects(objectLayer) {
        const objects = gameJson[this.stateID]["objects"];
        // console.log(objects);
        for (var i = 0; i < objects.length; ++i) {
            var currObject = objects[i];

            var id = currObject["id"];
            var path = currObject["path"];
            var pos = new Vector2D(currObject["position"][0], currObject["position"][1]);
            var veloc = new Vector2D(currObject["velocity"][0], currObject["velocity"][1]);
            var accel = new Vector2D(currObject["acceleration"][0], currObject["acceleration"][1]);
            var texID = currObject["textureID"];
            var sWidth = currObject["sWidth"];
            var sHeight = currObject["sHeight"];
            var dWidth = currObject["dWidth"] ? currObject["dWidth"] : sWidth;
            var dHeight = currObject["dHeight"] ? currObject["dHeight"] : sHeight;
            var currFrame = currObject["currentFrame"];
            var currRow = currObject["currentRow"];
            var numFrames = currObject["numFrames"];
            var animSpeed = currObject["animSpeed"];

            // object init data
            var initData = new InitData(pos, veloc, accel, texID, sWidth, sHeight,
                dWidth, dHeight, currFrame, currRow, numFrames, animSpeed);

            // create object
            var object = new (gameObjectFactory.createObject(id))();
            object.initObject(initData);

            // store object texture
            textureManager.storeTexture(texID, path);

            // store object in layer
            objectLayer.push(object);
        }
    }

}