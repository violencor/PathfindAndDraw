import * as Collision from "../collision.js"
import { Queue } from "../utils/queue.js";
import { CustomMap } from "../utils/map.js";
import { MinHeap } from "../utils/minHeap.js";
import { PF_NODE } from "./pf_node.js";

export class ASTAR_LIKE {

    _calG(pos, parentNode) {
        throw new Error("G Not implemented");
    }

    _calH(pos, parentNode) {
        throw new Error("H Not implemented");
    }

    _evaluate(pos, parentNode) {
        var g = 0;
        var h = 0;

        if (parentNode != undefined) {
            g = this._calG(pos, parentNode);
        }

        h = this._calH(pos, parentNode);

        return { g: g, h: h };
    }

    _createNode(pos, parentNode) {
        var val = this._evaluate(pos, parentNode);
        return new PF_NODE(pos, parentNode, val.g, val.h);
    }

    _get_neighbors(pos, posParent, startPos, endPos) {
        return Collision.neighbors(pos);
    }

    constructor(start_pos, end_pos) {
        this.start = start_pos;
        this.end = end_pos;
        this.openList = new MinHeap((node) => node.f);
        this.reached = new CustomMap((pos) => pos.toString());
        this.endNode = undefined;

        var startNode = new PF_NODE(start_pos, undefined, 0, 0);
        this.openList.insert(startNode);
        this.reached.set(startNode.pos, true);
    }

    step() {
        if (this.endNode != undefined) return [];
        if (this.openList.empty()) return [];

        var searchPosList = [];

        console.log("openList: ", this.openList.toString());
        var current = this.openList.popMin();
        console.log("current: ", current);

        if (current.parentNode == undefined) {
            var neighbors = this._get_neighbors(current.pos, this.start, this.start, this.end);
        } else {
            var neighbors = this._get_neighbors(current.pos, current.parentNode.pos, this.start, this.end);
        }

        // mark as reached (close list)
        this.reached.set(current.pos, true);

        for (let i = 0; i < neighbors.length; ++i) {
            var next = neighbors[i];

            // skip if start
            if (next.equals(this.start)) continue;

            // skip if reached
            if (this.reached.has(next)) continue;

            // create node
            var node = this._createNode(next, current)

            // found
            if (next.equals(this.end)) {
                this.endNode = node;
                break;
            }

            // if exists in open list, check update
            var openNode = this.openList.find(node);
            if (openNode == undefined) {
                // insert into open list
                this.openList.insert(node);
            } else {
                // update if better
                if (node.f < openNode.f) {
                    openNode.parentNode = current;
                    openNode.g = node.g;
                    openNode.h = node.h;
                    openNode.f = node.f;
                }
            }

        }

        // dump
        searchPosList.push(current.pos);

        return searchPosList;
    }

    run() {
        while (!found && this.step().length() > 0) {
        }
    }

    found() {
        return this.endNode != undefined;
    }

    getResult() {
        var result = [];
        if (this.endNode === undefined) return result;

        var current = this.endNode.parentNode;
        while (current.parentNode != undefined) {
            result.unshift(current.pos);
            current = current.parentNode;
        }

        return result;
    }

}
