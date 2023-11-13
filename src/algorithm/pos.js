export class POS {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(pos) {
        if (pos.x === this.x && pos.y === this.y) return true;
        return false;
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
}
