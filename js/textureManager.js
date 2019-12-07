'use strict'

var textureMap = new Map();

class TextureManager {
    constructor() {
        // textureMap is undefined if doing like this
        // this.textureMap = new Map();
    }

    storeTexture(filePath, textureID) {
        var texture = new Image();
        texture.src = filePath; // 'img/player.png'

        // when texture is successfully loaded
        texture.onload = function() {
            textureMap.set(textureID, texture);
        }
    }

    drawTexture(textureID, currentFrame, currentRow, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        var texture = textureMap.get(textureID);

        var sx = currentFrame * sWidth;
        var sy = currentRow * sHeight;

        ctx.drawImage(texture, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}