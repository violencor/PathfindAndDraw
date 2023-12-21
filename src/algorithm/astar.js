import { ASTAR_LIKE } from "../algorithm/astar_like.js"
import * as Collision from '../collision.js'

export class ASTAR extends ASTAR_LIKE {

    constructor(start_pos, end_pos) {
        super(start_pos, end_pos);
    }

    _calG(pos, parentNode) {
        return parentNode.g + Collision.get_col(pos);
    }

    _calH(pos, parentNode) {
        return Math.abs(pos.x - this.end.x) + Math.abs(pos.y - this.end.y);
    }

}
