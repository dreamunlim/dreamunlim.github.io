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
        //     // could not store 'request.response' in a global var from here
        //     gameJson = request.response;
        // }
    }

    parseLevel(state) {
        this.stateID = state.constructor.name; // define the caller

        switch(this.stateID) {
            case "LoadingState":
                this.parseFonts();
                this.parseTextures();
                this.parseSounds();
                break;
            case "MenuState":
                this.parseObjectLayer(state, "objects");
                this.parseObjectLayer(state, "buttons");
                break;
            case "PlayState":
                this.parseObjectLayer(state, "objects");
                this.parseObjectLayer(state, "enemies");
                this.parseObjectLayer(state, "buttons");
                this.parseObjectLayer(state, "counters");
                break;
            case "PauseState":
                break;
            case "GameoverState":
                this.parseObjectLayer(state, "buttons");
                break; 
        }

        this.stateID = null;
    }

    // LoadingState
    parseFonts() {
        const fonts = gameJson[this.stateID]["fonts"];

        for (var i = 0; i < fonts.length; ++i) {
            var currFont = fonts[i];

            var family = currFont["font-family"];
            var source = currFont["source"];
            var descriptors = {
                "style": currFont["descriptors"]["font-style"],
                "weight": currFont["descriptors"]["font-weight"],
                "display": currFont["descriptors"]["font-display"],
                "unicodeRange": currFont["descriptors"]["unicode-range"]
            };

            var font = new FontFace(family, "url(" + source + ")", descriptors);
            
            font.load().then(loadedFont => document.fonts.add(loadedFont));
        }
    }
    
    parseTextures() {
        const textures = gameJson[this.stateID]["textures"];
        
        var id;
        var path;

        for (var i = 0; i < textures.length; ++i) {
            id = textures[i][0];
            path = textures[i][1];
            textureManager.storeTexture(id, path);
        }
    }

    parseSounds() {
        const sounds = gameJson[this.stateID]["sounds"];
        
        var id;
        var path;

        for (var i = 0; i < sounds.length; ++i) {
            id = sounds[i][0];
            path = sounds[i][1];
            soundManager.storeSound(id, path);
        }
    }
    
    // MenuState, PlayState
    parseObjectLayer(state, layerName) {
        var objectLayer = new Array(); // new ObjectLayer();

        switch (layerName) {
            case "objects":
            case "enemies":
                this.parseObjects(objectLayer, layerName);
                break;
            case "buttons":
                this.parseButtons(objectLayer, layerName);
                break;
            case "counters":
                this.parseCounters(objectLayer, layerName);
                break;
        }

        // store current level objects layer
        state.level.layers.push(objectLayer);
    }

    parseObjects(objectLayer, layerName) {
        const objects = gameJson[this.stateID][layerName];

        for (var i = 0; i < objects.length; ++i) {
            var currObject = objects[i];

            var id = currObject["id"];
            var path = currObject["path"];
            var position = new Vector2D(currObject["position"][0], currObject["position"][1]);
            var velocity = new Vector2D(currObject["velocity"][0], currObject["velocity"][1]);
            var acceleration = new Vector2D(currObject["acceleration"][0], currObject["acceleration"][1]);
            var textureID = currObject["textureID"];
            var sWidth = currObject["sWidth"];
            var sHeight = currObject["sHeight"];
            var dWidth = currObject["dWidth"] || sWidth;
            var dHeight = currObject["dHeight"] || sHeight;
            var currentFrame = currObject["currentFrame"] || 0;
            var currentRow = currObject["currentRow"] || 0;
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
            var initData = {position, velocity, acceleration, textureID, sWidth, sHeight,
                dWidth, dHeight, currentFrame, currentRow, numFrames, animSpeed, collisionCircle};

            // create object
            var object = new (gameObjectFactory.createObject(id))();
            object.initObject(initData);

            // store object in layer
            objectLayer.push(object);
        }
    }

    parseButtons(objectLayer, layerName) {
        const objects = gameJson[this.stateID][layerName];

        for (var i = 0; i < objects.length; ++i) {
            var currObject = objects[i];

            var id = currObject["id"];
            var text = currObject["text"];
            var pos = {
                x: currObject["position"][0],
                y: currObject["position"][1]
            };
            var width = currObject["width"];
            var height = currObject["height"];

            var url = currObject["url"] || null;

            var initData = {text, pos, width, height, url};
            
            // create object
            var object = new (gameObjectFactory.createObject(id))(initData);

            // store object in layer
            objectLayer.push(object);
        }

    }

    parseCounters(objectLayer, layerName) {
        const objects = gameJson[this.stateID][layerName];

        for (var i = 0; i < objects.length; ++i) {
            var currObject = objects[i];

            var id = currObject["id"];
            var counterID = currObject["counterID"];
            var font = currObject["font"];
            var fontColour = currObject["fontColour"];
            var fontShadow = currObject["fontShadow"] || null;
            var fontShadowColour = currObject["fontShadowColour"];

            var initData = {counterID, font, fontColour, fontShadow, fontShadowColour};
            
            // create object
            var object = new (gameObjectFactory.createObject(id))(initData);

            // store object in layer
            objectLayer.push(object);
        }

    }

}