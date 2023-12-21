import { ASTAR_LIKE } from "../algorithm/astar_like.js"
import * as Collision from '../collision.js'

export class DIJKSTRA extends ASTAR_LIKE {

    constructor(start_pos, end_pos) {
        super(start_pos, end_pos);
    }

    _calG(pos, parentNode) {
        return parentNode.g + Collision.get_col(pos);
    }

    _calH(pos, parentNode) {
        return 0;
    }

}
