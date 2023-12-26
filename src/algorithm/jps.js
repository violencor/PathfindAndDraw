import { ASTAR_LIKE } from "../algorithm/astar_like.js"
import * as Collision from '../collision.js'
import { POS } from "./pos.js"

export class JPS extends ASTAR_LIKE {

    constructor(start_pos, end_pos) {
        super(start_pos, end_pos);
    }

    _calG(pos, parentNode) {
        return parentNode.g + Collision.get_col(pos) + Math.abs(pos.x - parentNode.pos.x) + Math.abs(pos.y - parentNode.pos.y);
    }

    _calH(pos, parentNode) {
        return Math.abs(pos.x - this.end.x) + Math.abs(pos.y - this.end.y);
    }

    _valid_pos(pos) {
        return Collision.is_valid_pos(pos) && Collision.get_col(pos) < 10000;
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

        return undefined;
    }

    _prune_neighbors(pos, posParent, startPos, endPos) {
        // 根据父节点和当前节点的位置关系，计算出下一个邻居节点的方向
        var dx = (pos.x - posParent.x) / Math.abs(pos.x - posParent.x);
        var dy = (pos.y - posParent.y) / Math.abs(pos.y - posParent.y);

        var list = [];
        var next = undefined;

        if (dx != 0 && dy != 0) {
            // diagonal move

            // nature neighbors
            var posTox = new POS(pos.x + dx, pos.y);
            var posToy = new POS(pos.x, pos.y + dy);
            var walkX = this._valid_pos(posTox);
            var walkY = this._valid_pos(posToy);
            if (walkX) list.push(posTox); // push the x direction neighbor
            if (walkY) list.push(posToy); // push the y direction neighbor

            // push the diagonal neighbor
            var posToDiagonal = new POS(pos.x + dx, pos.y + dy);
            if ((walkX || walkY) && this._valid_pos(posToDiagonal)) {
                list.push(posToDiagonal);
            }

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

        return list;

    }

    _find_neighbors(pos, startPos, endPos) {
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

            var next = this._calc_start_neighbor(pos, dx, dy);
            if (next == undefined) continue;

            list.push(next);
        }

        return list;
    }

    _expand_diagonal_successor(pos, dx, dy, startPos, endPos) {

        var cur = pos;

        while (true) {

            // end
            if (cur.equals(endPos)) return cur;

            // has forced neighbor
            if ((!this._valid_pos(new POS(cur.x - dx, cur.y)) && this._valid_pos(new POS(cur.x -dx, cur.y + dy)))
                || (!this._valid_pos(new POS(cur.x, cur.y - dy)) && this._valid_pos(new POS(cur.x + dx, cur.y - dy)))) {
                return cur;
            }

            // check if we can find jump point on x direction
            var posTox = new POS(cur.x + dx, dy);
            var walkX = this._valid_pos(posTox);
            if (walkX && this._expand_X_successor(posTox, dx, startPos, endPos) != undefined) {
                return cur;
            }

            // check if we can find jump point on y direction
            var posToy = new POS(cur.x, cur.y + dy);
            var walkY = this._valid_pos(posToy);
            if (walkY && this._expand_Y_successor(posToy, dy, startPos, endPos) != undefined) {
                return cur;
            }

            // diagonal direction move
            var next = new POS(cur.x + dx, cur.y + dy);

            // if next cannot reach, return undefined
            if (!walkX && walkY) return undefined;
            if (!this._valid_pos(next)) return undefined;

            // update cur with next
            cur = next;
        }
    }

    _expand_X_successor(pos, dx, startPos, endPos) {

        var cur = pos;

        while (true) {

            // end
            if (cur.equals(endPos)) return cur;

            // has forced neighbor
            if ( (!this._valid_pos(new POS(cur.x, cur.y + 1))
                    && this._valid_pos(new POS(cur.x + dx, cur.y + 1)))
                || (!this._valid_pos(new POS(cur.x, cur.y - 1))
                    && this._valid_pos(new POS(cur.x + dx, cur.y - 1)))) {
                return cur;
            }

            // x direction move
            var next = new POS(cur.x + dx, cur.y);

            // if next is not valid, return undefined
            if (!this._valid_pos(next)) return undefined;

            // update cur with next
            cur = next;
        }
    }

    _expand_Y_successor(pos, dy, startPos, endPos) {

        var cur = pos;

        while (true) {

            // end
            if (cur.equals(endPos)) return cur;

            // has forced neighbor
            if ( (!this._valid_pos(new POS(cur.x + 1, cur.y))
                    && this._valid_pos(new POS(cur.x + 1, cur.y + dy)))
                || (!this._valid_pos(new POS(cur.x - 1, cur.y))
                    && this._valid_pos(new POS(cur.x - 1, cur.y + dy)))) {
                return cur;
            }

            // y direction move
            var next = new POS(cur.x, cur.y + dy);

            // if next is not valid, return undefined
            if (!this._valid_pos(next)) return undefined;

            // update cur with next
            cur = next;
        }

    }

    _expand_successor(pos, neighbor, startPos, endPos) {

        var dx = (neighbor.x - pos.x);
        var dy = (neighbor.y - pos.y);

        // 按邻居方向确定扩展的方向
        var jp = undefined;

        // diagonal expand
        if (dx != 0 && dy != 0) {
            jp = this._expand_diagonal_successor(neighbor, dx, dy, startPos, endPos);
        }

        // x direction expand
        if (dx != 0) {
            jp = this._expand_X_successor(neighbor, dx, startPos, endPos);
        }

        // y direction expand
        if (dy != 0) {
            jp = this._expand_Y_successor(neighbor, dy, startPos, endPos);
        }

        return jp;
    }

    _get_neighbors(pos, posParent, startPos, endPos) {

        var neighbors = undefined;
        var jump_points = [];

        // 寻找邻居节点
        if (pos == startPos) {
            neighbors = this._find_neighbors(pos, startPos, endPos);
        } else {
            neighbors = this._prune_neighbors(pos, posParent, startPos, endPos);
        }

        console.log("pos: ", pos, ", neighbors: ", neighbors);

        // expand succesors of all neighbors
        for (let i = 0; i < neighbors.length; ++i) {
            var jp = this._expand_successor(pos, neighbors[i], startPos, endPos);
            if (jp == undefined) continue; // cannot find jump points

            jump_points.push(jp);
        }

        console.log("pos: ", pos, ", jump_points: ", jump_points);

        return jump_points;
    }

}
