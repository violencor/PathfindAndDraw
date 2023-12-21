import { ASTAR_LIKE } from "../algorithm/astar_like.js"
import * as Collision from '../collision.js'

export class JPS extends ASTAR_LIKE {

    constructor(start_pos, end_pos) {
        super(start_pos, end_pos);
    }

    _calG(pos, parentNode) {
        return parentNode.g + Collision.get_col(pos);
    }

    _calH(pos, parentNode) {
        return Math.abs(pos.x - this.end.x) + Math.abs(pos.y - this.end.y);
    }

    _valid_pos(pos) {
        return Collision.is_valid_pos(pos) && Collision.get_col(pos) == 0;
    }

    _diagonal_move(pos, endPos) {

        var next = pos;

        // move to the diagonal direction
        while (true) {
            next = new POS(next.x + 1, next.y + 1);

            var next = new POS(pos.x + dx, pos.y + dy);

            if (!this._valid_pos(next)) {
                break;
            }
        }
    }

    _get_neighbors(pos, endPos) {

        var list = [];

        const dirs = [
            new POS(0, 1),
            new POS(0, -1),
            new POS(1, 0),
            new POS(-1, 0),
            new POS(1, 1),
            new POS(1, -1),
            new POS(-1, 1),
            new POS(-1, -1)
        ];

        for (let i = 0; i < dirs.length; ++i) {
            var dx = dirs[i].x;
            var dy = dirs[i].y;

            if (dx && dy) {
                // diagonal move
            } else {
                // straight move
            }

            list.push(next);
        }
    }

}
