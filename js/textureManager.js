'use strict'

class TextureManager {
    constructor() {
        this.textureMap = new Map();
    }

    storeTexture(textureID, filePath) {
        var texture = new Image();
        texture.src = filePath; // 'img/player.png'
        // texture.id = textureID; // id to apply css

        // when texture is successfully loaded
        texture.onload = function () {
            textureManager.textureMap.set(textureID, texture);
        }
    }

    drawTexture(textureID, currentFrame, currentRow, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        var texture = this.textureMap.get(textureID);

        var sx = currentFrame * sWidth;
        var sy = currentRow * sHeight;

        ctx.drawImage(texture, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}