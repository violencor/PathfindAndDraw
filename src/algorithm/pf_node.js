import { POS } from "./pos.js";

export class PF_NODE {
    constructor(pos, parentNode, g, h) {
        this.pos = pos;
        this.parentNode = parentNode;
        this.g = g;
        this.h = h;
        this.f = g + h;
    }

    toString() {
        return this.pos.toString();
    }
}
