'use strict'

var gameJson;

class LevelParser {
    // gameJson;

    constructor() {
        this.parseJson("json/initAll.json");

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

    parseLevel(level) {
        this.parseObjectLayer(level);
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
        const objects = gameJson["objects"];
        // console.log(objects);
        for (var i = 0; i < objects.length; ++i) {
            var currObject = objects[i];

            var id = currObject["id"];
            var path = currObject["path"];
            var pos = new Vector2D(currObject["position"][0], currObject["position"][1]);
            var veloc = new Vector2D(currObject["velocity"][0], currObject["velocity"][1]);
            var accel = new Vector2D(currObject["acceleration"][0], currObject["acceleration"][1]);
            var texID = currObject["textureID"];
            var width = currObject["width"];
            var height = currObject["height"];
            var currFrame = currObject["currentFrame"];
            var currRow = currObject["currentRow"];
            var numFrames = currObject["numFrames"];
            var animSpeed = currObject["animSpeed"];

            // object init data
            var initData = new InitData(pos, veloc, accel, texID, width, height, currFrame,
                currRow, numFrames, animSpeed);

            // create object
            var object = gameObjectFactory.createObject(id);
            object.initObject(initData);

            // store object texture
            textureManager.storeTexture(texID, path);

            // store object in layer
            objectLayer.push(object);
        }
    }

}