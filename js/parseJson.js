'use strict'


function parseJson (jsonPath) {
    var request = new XMLHttpRequest();

    request.open('GET', jsonPath);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
        // can't figure out how store 'request.response' even in a global var  
        // ok, pass json object further
        parseObjects(request.response);
    }
}


function parseObjects (gameJson) {
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
        player = gameObjectFactory.createObject(id);
        player.initObject(initData);
        
        //
        textureManager.storeTexture(texID, path);
    }
}