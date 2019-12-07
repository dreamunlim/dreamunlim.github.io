'use strict'

class Vector2D {
    // default initialisation
    constructor (x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get X() {return this.x; }
    get Y() {return this.y; }

    set X(x) {this.x = x; }
    set Y(y) {this.y = y; }

    //distance between two points
    vecLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    //add two vectors
    add (v2) {
        return new Vector2D (this.x + v2.X, this.y + v2.Y);
    }

    //multiply by a scalar
    mult (scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    //subtract vectors
    subtract (v2) {
        return new Vector2D(this.x - v2.X, this.y - v2.Y);
    }

    //divide by a scalar
    divide (scalar) {
        return new Vector2D(this.x / scalar, this.y / scalar);
    }

    //scale down the current vector to a unit vector
    normalise() {
        let length = this.vecLength();

        if (length > 0)//check division by 0
        {
            this.x = this.x / length;
            this.y = this.y / length;
        }
    }

}