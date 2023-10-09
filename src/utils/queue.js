export class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        return this.items.shift();
    }

    empty() {
        if (this.items.length == 0) return true;

        return false;
    }

    length() {
        return this.items.length;
    }

    toString() {
        return this.items.toString();
    }
}