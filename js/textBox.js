'use strict'

class _Text {
    constructor() {
        this.lines = [
            // format data order: [text, align, font, fontColour]
            [["Good Job!",0,0,0]],
            [["You scored ",1,1,1], ["",1,1,2], [" Points",1,1,1]],
            [["And last ",1,1,1], ["",1,1,2], [" Min ",1,1,1], ["",1,1,2], [" Sec",1,1,1]]
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
            2: "darkgoldenrod"
        };
    }

    drawText(that) {
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // populate lines array missing spots with PlayState data
        var gameoverState = gameStateMachine.stack[2];
        var formattedMinutes = Math.floor(gameoverState.playStateTime / 1000 / 60);
        var formattedseconds = Math.floor((gameoverState.playStateTime / 1000) % 60);
        this.lines[1][1][0] = gameoverState.playStateScore;
        this.lines[2][1][0] = formattedMinutes;
        this.lines[2][3][0] = formattedseconds;

        this.drawLines(that);
        
        // turn off shadow
        ctx.shadowColor = "rgba(0,0,0,0)";
    }

    drawLines(that) {
        // first line position
        var x = that.x + 10;
        var y = that.y + 10;
        var spacing = 55;

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
            y += spacing;
        }
    }

}

class TextBox {
    constructor() {
        this.text = new _Text();

        this.x = 80;
        this.y = 185;
        this.width = 480;
        this.height = 270;
        this.colour = "rgba(255,192,203, 0.3)"; // pink
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