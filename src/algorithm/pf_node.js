import { POS } from "./pos.js";

export class PF_NODE {
    constructor(pos, parentNode, g, h) {
        this.pos = pos;
        this.parentNode = parentNode;
        this.g = g;
        this.h = h;
        this.f = g + h;
    }

    equals(other) {
        return this.pos.equals(other.pos);
    }

    toString() {
        return "[" + this.pos.toString() + ": " + this.f + "]";
    }
}
