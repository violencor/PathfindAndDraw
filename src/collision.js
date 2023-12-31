import { POS } from "./algorithm/pos";

// export const width = 20;
// export const length = 20;
// const cols = [
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 10000, 10000, 10000, 10000, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 10000, 10000, 10000, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     16, 16, 16, 8, 2, 1, 1, 1, 1, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     16, 16, 16, 8, 2, 1, 1, 1, 1, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     16, 16, 16, 8, 2, 1, 1, 1, 1, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     16, 16, 16, 8, 2, 1, 1, 1, 1, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     1, 1, 1, 1, 1, 1, 1, 1, 1, 10000, 10000, 1, 1, 1, 1, 1, 1, 1, 1, 1,
// ];
// export const start_pos = new POS(1, 1);
// export const end_pos = new POS(17, 17);

export const width = 5;
export const length = 5;
const cols = [
    1, 1, 10000, 10000, 1,
    1, 1, 10000, 10000, 1,
    1, 1, 10000, 10000, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
];

export const start_pos = new POS(0, 4);
export const end_pos = new POS(4, 4);

export function is_valid_pos(pos) {
    if (pos.y >= length || pos.y < 0
        || pos.x >= width || pos.x < 0) {
        return false;
    }

    return true;
}

export function get_col(pos) {
    if (!is_valid_pos(pos)) return 1;
    return cols[(length-1-pos.y) * width + pos.x];
}

export function neighbors(pos) {
    var list = [];

    const dirs = [
        new POS(0, 1),
        new POS(0, -1),
        new POS(1, 0),
        new POS(-1, 0),
        // new POS(1, 1),
        // new POS(1, -1),
        // new POS(-1, 1),
        // new POS(-1, -1)
    ];

    for (let i = 0; i < dirs.length; ++i) {
        var offset = dirs[i];

        var next = new POS(pos.x + offset.x, pos.y + offset.y);
        if (!is_valid_pos(next)) continue;
        if (get_col(next) >= 10000) continue;

        list.push(next);
    }

    return list;

}
