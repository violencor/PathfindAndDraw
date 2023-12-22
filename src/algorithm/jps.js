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

    _calc_start_neighbor(basePos, dx, dy) {
        var next = new POS(basePos.x + dx, basePos.y + dy);

        if (!this._valid_pos(next)) {
            return undefined;
        }

        if (dx != 0 && dy != 0) {
            // diagonal move
            // we cannot move to diagonal direction straightly
            // once we move to diagonal direction, we must move to straight direction
            // so we need to check if we can move to one of straight directions
            if (this._valid_pos(new POS(basePos.x + dx, basePos.y))
                || this._valid_pos(new POS(basePos.x, basePos.y + dy))) {
                return next;
            }
        } else {
            // straight move
            return next;
        }

        return next;
    }

    _find_neighbors(pos, posParent, startPos, endPos) {
        // 根据父节点和当前节点的位置关系，计算出下一个邻居节点的方向
        var dx = (pos.x - posParent.x) / std::abs(pos.x - posParent.x);
        var dy = (pos.y - posParent.y) / std::abs(pos.y - posParent.y);

        var list = [];
        var next = undefined;

        if (dx != 0 && dy != 0) {
            // diagonal move

            // nature neighbors
            posTox = new POS(pos.x + dx, pos.y);
            posToy = new POS(pos.x, pos.y + dy);
            var walkX = this._valid_pos(posTox);
            var walkY = this._valid_pos(posToy);
            if (walkX) list.push(posTox); // push the x direction neighbor
            if (walkY) list.push(posToy); // push the y direction neighbor
            if (!walkX && !walkY) return list; // no forced neighbors

            // push the diagonal neighbor
            posToDiagonal = new POS(pos.x + dx, pos.y + dy);
            if (this._valid_pos(posToDiagonal)) list.push(posToDiagonal);

            // forced neighbors
            if (walkX) {
                var obstaclePos = new POS(pos.x, pos.y - dy);
                if (!this._valid_pos(obstaclePos)) {
                    next = new POS(pos.x + dx, pos.y - dy);
                    list.push(next);
                }
            }

            if (walkY) {
                var obstaclePos = new POS(pos.x - dx, pos.y);
                if (!this._valid_pos(obstaclePos)) {
                    next = new POS(pos.x - dx, pos.y + dy);
                    list.push(next);
                }
            }

        } else {
            // straight move

            // x direction move
            if (dx != 0) {

                // nature neighbor
                next = new POS(pos.x + dx, pos.y);
                list.push(next);

                // forced neighbors
                if (!this._valid_pos(new POS(pos.x, pos.y + 1))) {
                    next = new POS(pos.x + dx, pos.y + 1);
                    list.push(next);
                }

                if (!this._valid_pos(new POS(pos.x, pos.y - 1))) {
                    next = new POS(pos.x + dx, pos.y - 1);
                    list.push(next);
                }
            }

            // y direction move
            if (dy != 0) {

                // nature neighbor
                next = new POS(pos.x, pos.y + dy);
                list.push(next);

                // forced neighbors
                if (!this._valid_pos(new POS(pos.x + 1, pos.y))) {
                    next = new POS(pos.x + 1, pos.y + dy);
                    list.push(next);
                }

                if (!this._valid_pos(new POS(pos.x - 1, pos.y))) {
                    next = new POS(pos.x - 1, pos.y + dy);
                    list.push(next);
                }
            }

        }

    }

    _find_start_neighbors(pos, startPos, endPos) {
        var list = []

        // 找到8个方向上所有可用邻居
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

            var next = this._calc_start_neighbor(pos, 0, 1);
            if (next == undefined) continue;

            list.push(next);
        }
    }

    _get_neighbors(pos, posParent, startPos, endPos) {

        var neighbors = undefined;

        // 寻找邻居节点
        if (pos == startPos) {
            neighbors = _find_start_neighbors(pos, startPos, endPos);
        } else {
            neighbors = _find_neighbors(pos, posParent, startPos, endPos);
        }

        // expand all neighbors
        for (let i = 0; i < neighbors.length; ++i) {
            // TODO: expand successor
        }

    }

}
