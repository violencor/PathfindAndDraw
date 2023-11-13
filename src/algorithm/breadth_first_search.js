import * as Collision from "../collision.js"
import { Queue } from "../utils/queue.js";
import { CustomMap } from "../utils/map.js";

export class BFS {

    constructor(start_pos, end_pos) {
        this.start = start_pos;
        this.end = end_pos;
        this.frontier = new Queue();
        this.frontier.enqueue(start_pos);
        this.reached = new CustomMap((pos) => pos.toString());
        this.reached.set(start_pos, true);
        this.found = false;
    }

    step() {
        if (this.found) return [];
        if (this.frontier.empty()) return [];
        if (this.reached.has(this.end)) return [];

        var search_pos_list = [];

        // console.log("frontier: ", this.frontier.toString());
        var current = this.frontier.dequeue();
        // console.log("current: (%d, %d) ", current.x, current.y);

        var neighbors = Collision.neighbors(current);
        for (let i = 0; i < neighbors.length; ++i) {
            var next = neighbors[i];
            if (next.equals(this.start)) continue;

            // found
            if (next.equals(this.end)) {
                this.found = true;
                break;
            }

            // skip if reached
            if (this.reached.has(next)) continue;

            // next pos record
            this.frontier.enqueue(next);
            this.reached.set(next, true);

            // dump
            search_pos_list.push(next);
        }

        return search_pos_list;
    }

    run() {
        while (step().length() > 0) {
        }
    }

}
