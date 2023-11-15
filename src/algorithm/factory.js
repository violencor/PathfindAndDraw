import { BFS } from './breadth_first_search.js';
import { GREEDY } from './greedy.js';
import { ASTAR } from './astar.js';
import { DIJKSTRA } from './dijkstra.js';

export const algos = ['DIJKSTRA', 'GREEDY', 'A*', 'BFS'];

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
        default:
            throw new Error('Unknown Algorithm Name');
            return undefined;
    }
}
