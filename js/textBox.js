'use strict'

class _Text {
    constructor() {
        this.lines = [];
        this.spacing = 0;

        this.menuStateText = [
            // format data order: [text, align, font, fontColour]
            [["By playing you agree to",1,1,1]],
            [["Terms of Use ",1,1,3], ["and ",1,1,1], ["Privacy Policy",1,1,3]],
            [["Outlined in the ",1,1,1], ["Help ",1,1,3], ["section",1,1,1]]
        ];

        this.gameoverStateText = [
            // format data order: [text, align, font, fontColour]
            [["Good Job!",0,0,0]],
            [["You scored ",1,1,1], ["",1,1,2], [" Points",1,1,1]],
            [["And lasted ",1,1,1], ["",1,1,2], [" Min ",1,1,1], ["",1,1,2], [" Sec",1,1,1]]
        ];

        this.decodeAlign = {
            0: "center",
            1: "start"
        };

        this.decodeFont = {
            0: "55px Bebas Neue",
            1: "50px Bebas Neue"
        };

        this.decodeFontColour = {
            0: "brown",
            1: "mediumpurple",
            2: "darkgoldenrod",
            3: "#d17586" // strawberry ice cream yogurt
        };
    }

    drawText(that) {
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        if (that.state.constructor.name == "GameoverState") {
            // populate lines array missing spots with PlayState data
            var gameoverState = gameStateMachine.stack[2];
            this.lines[1][1][0] = gameoverState.dataToShare.formattedScore;
            this.lines[2][1][0] = gameoverState.dataToShare.formattedMinutes;
            this.lines[2][3][0] = gameoverState.dataToShare.formattedSeconds;
        }

        this.drawLines(that);
        
        // turn off shadow
        ctx.shadowColor = "rgba(0,0,0,0)";
    }

    drawLines(that) {
        // first line position
        var x = that.x + 10;
        var y = that.y + 10;

        // loop through lines
        for (var i = 0; i != this.lines.length; ++i) {
            // i assume whole line to be of the same font size
            // draw dummy line to have proper font size width returned later
            var fontCode = this.lines[i][0][2];
            var font = this.decodeFont[fontCode];
            drawText(" ", 0, 0, font, "center", "brown");

            // reset line start x position basing on first word in line
            var alignCode = this.lines[i][0][1];
            var align = this.decodeAlign[alignCode];

            if (align == "center") {
                x = that.x + that.width / 2;
                ctx.shadowColor = "salmon";

            } else if (align == "start") {
                x = that.x + 10;
                ctx.shadowColor = "brown";
            }

            // loop through line words
            for (var j = 0; j != this.lines[i].length; ++j) {
                // get word format data
                // format data order: [text, align, font, fontColour]
                var text = this.lines[i][j][0];
                var alignCode = this.lines[i][j][1];
                var fontCode = this.lines[i][j][2];
                var fontColourCode = this.lines[i][j][3];

                //decoded format
                var align = this.decodeAlign[alignCode];
                var font = this.decodeFont[fontCode];
                var fontColour = this.decodeFontColour[fontColourCode];
                
                // draw formatted word
                drawText(text, x, y, font, align, fontColour);

                // next word x position
                x += ctx.measureText(text).width;
            }

            // next line y position
            y += this.spacing;
        }
    }

}

class TextBox {
    constructor(state) {
        // text box owner
        this.state = state;

        this.text = new _Text();

        // state specific adjustments
        switch (this.state.constructor.name) {
            case "MenuState":
                this.width = 550;
                this.height = 270;
                this.colour = "rgba(255,192,203, 1)"; // pink
                this.text.lines = this.text.menuStateText;
                this.text.spacing = 55;
                break;
            case "GameoverState":
                this.width = 480;
                this.height = 270;
                this.colour = "rgba(255,192,203, 0.3)"; // pink
                this.text.lines = this.text.gameoverStateText;
                this.text.spacing = 55;
                break;
        }

        this.x = (canvasInitialWidth - this.width) / 2;
        this.y = (canvasInitialHeight - this.height) / 2;
    }

    drawTextBox() {
        clearCanvas(this.x, this.y, this.width, this.height, this.colour);
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "brown";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        // ctx.lineJoin = "miter";

        this.text.drawText(this);
    }

    alignOkButton(button) {
        // amend button position to TextBox bottom center
        button.position.x = this.x + (this.width / 2 - button.width / 2);
        button.position.y = this.y + (this.height - button.height) - 10;
        // amend button initial position
        button.initial.position.x = button.position.x;
        button.initial.position.y = button.position.y;
    }

}