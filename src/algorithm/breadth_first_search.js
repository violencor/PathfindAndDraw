import * as Collision from "../collision.js"
import { Queue } from "../utils/queue.js";

export class BFS {

    constructor(start_pos, end_pos) {
        this.start = start_pos;
        this.end = end_pos;
        this.frontier = new Queue();
        this.frontier.enqueue(start_pos);
        this.reached = new Map();
        this.reached.set(start_pos, true);
    }

    step() {
        if (this.frontier.empty()) return [];
        if (this.reached.has(this.end)) return [];

        var search_pos_list = [];

        var current = this.frontier.dequeue();
        // console.log("frontier: ", this.frontier.toString());
        // console.log("current: (%d, %d) ", current.x, current.y);

        var neighbors = Collision.neighbors(current);
        for (let i = 0; i < neighbors.length; ++i) {
            var next = neighbors[i];
            search_pos_list.push(next);

            // found
            if (next == this.end) break;

            // next pos record
            if (!this.reached.has(next)) {
                this.frontier.enqueue(next);
                this.reached.set(next, true);
                console.log("bfs step: (%d, %d)", next.x, next.y);
            }
        }

        return search_pos_list;
    }

    run() {
        while (step().length() > 0) {
        }
    }

}