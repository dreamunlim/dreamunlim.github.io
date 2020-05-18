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
            case "LoadingState":
                this.parseTextures(state);
                this.parseSounds(state);
                break;
            case "MenuState":
                break;
            case "PlayState":
                this.parseObjectLayer(state.level);
                break;
            case "PauseState":
                break;
            case "GameoverState":
                break; 
        }

        this.stateID = null;
    }

    // LoadingState
    parseTextures(state) {
        const textures = gameJson[this.stateID]["textures"];
        state.totalAssets += textures.length;
        
        var id;
        var path;

        for (var i = 0; i < textures.length; ++i) {
            id = textures[i][0];
            path = textures[i][1];
            textureManager.storeTexture(id, path);
        }
    }

    parseSounds(state) {
        const sounds = gameJson[this.stateID]["sounds"];
        state.totalAssets += sounds.length;
        
        var id;
        var path;

        for (var i = 0; i < sounds.length; ++i) {
            id = sounds[i][0];
            path = sounds[i][1];
            soundManager.storeSound(id, path);
        }
    }
    
    // PlayState
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
            var dWidth = currObject["dWidth"] || sWidth;
            var dHeight = currObject["dHeight"] || sHeight;
            var currFrame = currObject["currentFrame"] || 0;
            var currRow = currObject["currentRow"] || 0;
            var numFrames = currObject["numFrames"] || 1;
            var animSpeed = currObject["animSpeed"] || 100;
            var collisionCircle = currObject["collisionCircle"] || null;
            var soundPath = currObject["soundPath"] || null;
            
            // convert literal object to vector
            if (collisionCircle != null) {
                let temp = collisionCircle;
                collisionCircle = new Vector2D(temp.center[0], temp.center[1]);
                collisionCircle.radius = temp.radius;
            };

            // object init data
            var initData = new InitData(pos, veloc, accel, texID, sWidth, sHeight,
                dWidth, dHeight, currFrame, currRow, numFrames, animSpeed, collisionCircle);

            // create object
            var object = new (gameObjectFactory.createObject(id))();
            object.initObject(initData);

            // store object in layer
            objectLayer.push(object);
        }
    }

}