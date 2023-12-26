import { BFS } from './breadth_first_search.js';
import { GREEDY } from './greedy.js';
import { ASTAR } from './astar.js';
import { DIJKSTRA } from './dijkstra.js';
import { JPS } from './jps.js';

export const algos = ['JPS', 'GREEDY', 'A*', 'BFS', 'DIJKSTRA'];

export function create(name, start_pos, end_pos) {
    switch (name) {
        case 'GREEDY':
            return new GREEDY(start_pos, end_pos);
        case 'A*':
            return new ASTAR(start_pos, end_pos);
        case 'DIJKSTRA':
            return new DIJKSTRA(start_pos, end_pos);
        case 'BFS':
            return new BFS(start_pos, end_pos);
        case 'JPS':
            return new JPS(start_pos, end_pos);
        default:
            throw new Error('Unknown Algorithm Name');
            return undefined;
    }
}
