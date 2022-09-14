import { canvas } from "./canvas.js";
import { textureManager } from "./textureManager.js";

class OverridePicture {
    constructor() {
        this.input = document.createElement("input");
        this.input.setAttribute("type", "file");
        this.input.setAttribute("accept", ".jpg, .jpeg, .png, .gif, .bmp");
        this.input.addEventListener("change", () => { this.processPicture() }, false);
        document.body.insertBefore(this.input, canvas.nextElementSibling);

        this.replaceableTextureIDs = ["enemy-red", "enemy-purple"];
        this.texturePointer = 0;

        this.overridePicButton = null;
    }

    processPicture() {
        const minWidth = 240;
        const minHeight = 240;

        const file = this.input.files[0];
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = () => {
            // minimum dimensions check
            if (image.naturalWidth < minWidth || image.naturalHeight < minHeight) {
                this.overridePicButton.setHintMessage("Low Res");
                return;
            }

            // cycle texture IDs
            this.texturePointer = (++this.texturePointer) % this.replaceableTextureIDs.length;

            const resizedPic = this.resizePicture(minWidth, minHeight, image);
            const blendedPic = this.blendPicture(resizedPic);

            // replace texture
            textureManager.textureMap.set(this.replaceableTextureIDs[this.texturePointer], blendedPic);
            this.overridePicButton.setHintMessage("Success");

            // explicitly release file URL
            URL.revokeObjectURL(image.src);

            // log event
            gtag("event", "override_picture");
        }

        image.onerror = () => {
            // treat both zero size and file extension substitution as bad format
            if (image.naturalWidth == 0 && image.naturalHeight == 0) {
                this.overridePicButton.setHintMessage("Bad Format");
            }

            // explicitly release file URL
            URL.revokeObjectURL(image.src);
        }
    }

    resizePicture(minWidth, minHeight, image) {
        // scratchpad
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.height = minWidth;

        // obtain clipping box
        var scale = 1,
        sWidth = 1,
        sHeight = 1;

        if (image.naturalWidth < image.naturalHeight) {
            scale = image.naturalWidth / minWidth;
        } else {
            scale = image.naturalHeight / minHeight;
        }

        sWidth = sHeight = minWidth * scale;

        // center clipping box within source image
        var sx = 0,
        sy = 0;

        if (image.naturalWidth < image.naturalHeight) {
            sy = (image.naturalHeight - sHeight) / 2;
        } else {
            sx = (image.naturalWidth - sWidth) / 2;
        }

        // downsize
        ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

        return ctx;
    }

    blendPicture(ctx) {
        // blending mode
        ctx.globalCompositeOperation = "destination-in";

        // overlay circle mask
        var x = ctx.canvas.width / 2;
        var y = ctx.canvas.height / 2;
        var radius = ctx.canvas.width / 2;
        var startAngle = 0;
        var endAngle = 2 * Math.PI;
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx.fill();

        //
        const image = new Image();
        image.src = ctx.canvas.toDataURL("image/png");

        return image;
    }
}

export { OverridePicture };