import { canvas } from "./canvas.js";
import { textureManager } from "./textureManager.js";

class OverridePicture {
    constructor() {
        this.input = document.createElement("input");
        this.input.setAttribute("type", "file");
        this.input.setAttribute("accept", ".jpg, .jpeg, .png, .gif, .bmp");
        this.input.addEventListener("change", () => { this.processPicture() }, false);
        document.body.insertBefore(this.input, canvas.nextElementSibling);

        this.texturePointer = 0;
        this.replaceableTextureIDs = ["enemy-red", "enemy-purple"];

        this.overridePicButton = null;
    }

    processPicture() {
        // pop-up closed without file selected
        if (! this.input.files.length) {
            return;
        }

        const file = this.input.files[0];
        const userImage = new Image();
        userImage.src = URL.createObjectURL(file);

        userImage.onload = () => {
            // explicitly release file URL
            URL.revokeObjectURL(userImage.src);

            const minWidth = 240;
            const minHeight = 240;

            // minimum dimensions check
            if (userImage.naturalWidth < minWidth || userImage.naturalHeight < minHeight) {
                this.overridePicButton.setHintMessage("Low Res");
                return;
            }

            // scratchpad
            const tempCanvas = document.createElement("canvas");
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = tempCanvas.height = minWidth;

            this.resizePicture(minWidth, minHeight, userImage, tempCtx);
            this.blendPicture(tempCtx);

            const modifiedImage = new Image();
            modifiedImage.src = tempCanvas.toDataURL("image/png");

            // cycle texture IDs
            this.texturePointer = (++this.texturePointer) % this.replaceableTextureIDs.length;
            
            // replace texture
            textureManager.textureMap.set(this.replaceableTextureIDs[this.texturePointer], modifiedImage);
            this.overridePicButton.setHintMessage("Success");

            // log event
            gtag("event", "override_picture");
        }

        userImage.onerror = () => {
            // explicitly release file URL
            URL.revokeObjectURL(userImage.src);

            // treat both zero size and file extension substitution as bad format
            if (userImage.naturalWidth == 0 && userImage.naturalHeight == 0) {
                this.overridePicButton.setHintMessage("Bad Format");
            }
        }
    }

    resizePicture(minWidth, minHeight, userImage, tempCtx) {
        // obtain clipping box
        let scale = 1,
            sWidth = 1,
            sHeight = 1;

        if (userImage.naturalWidth < userImage.naturalHeight) {
            scale = userImage.naturalWidth / minWidth;
        } else {
            scale = userImage.naturalHeight / minHeight;
        }

        sWidth = sHeight = minWidth * scale;

        // center clipping box within source image
        let sx = 0,
            sy = 0;

        if (userImage.naturalWidth < userImage.naturalHeight) {
            sy = (userImage.naturalHeight - sHeight) / 2;
        } else {
            sx = (userImage.naturalWidth - sWidth) / 2;
        }

        // downsize
        tempCtx.drawImage(userImage, sx, sy, sWidth, sHeight, 0, 0, minWidth, minHeight);
    }

    blendPicture(tempCtx) {
        // overlay circle mask
        tempCtx.globalCompositeOperation = "destination-in";
        let x = tempCtx.canvas.width / 2;
        let y = tempCtx.canvas.height / 2;
        let radius = tempCtx.canvas.width / 2;
        let startAngle = 0;
        let endAngle = 2 * Math.PI;
        tempCtx.arc(x, y, radius, startAngle, endAngle);
        tempCtx.fill();

        // overlay contour frame
        tempCtx.globalCompositeOperation = "source-over";
        tempCtx.lineWidth = 9;
        radius = radius - tempCtx.lineWidth / 2;
        tempCtx.beginPath();
        tempCtx.arc(x, y, radius, startAngle, endAngle);
        tempCtx.stroke();
    }
}

export { OverridePicture };