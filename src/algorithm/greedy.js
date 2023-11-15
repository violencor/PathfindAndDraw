import { ASTAR_LIKE } from "../algorithm/astar_like.js"

export class GREEDY extends ASTAR_LIKE {

    constructor(start_pos, end_pos) {
        super(start_pos, end_pos);
    }

    _calG(pos, parentNode) {
        return 0;
    }

    _calH(pos, parentNode) {
        return Math.abs(pos.x - this.end.x) + Math.abs(pos.y - this.end.y);
    }

}
