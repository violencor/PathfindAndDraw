export class MinHeap {

    constructor(objScoreFunc) {
        this.heap = [];
        this.objScoreFunc = objScoreFunc;
    }

    empty() {
        return this.heap.length === 0;
    }

    // Insert an element into the heap
    insert(value) {
        this.heap.push(value);
        // this.bubbleUp();
    }

    // find
    find(value) {
        for (let i = 0; i < this.heap.length; ++i) {
            if (this.heap[i].equals(value)) {
                return this.heap[i];
            }
        }
        return undefined;
    }

    // Extract the minimum element from the heap
    popMin() {
        if (this.heap.length === 0) {
            return undefined; // Heap is empty
        }

        var minScore = 100000;
        var minNodeIdx = -1;
        for (let i = 0; i < this.heap.length; ++i) {
            var score = this.objScoreFunc(this.heap[i]);
            if (score < minScore) {
                minScore = score;
                minNodeIdx = i;
            }
        }

        if (minNodeIdx < 0) {
            return undefined;
        }

        const minNode = this.heap[minNodeIdx];
        this.heap[minNodeIdx] = this.heap[this.heap.length - 1];
        this.heap.pop();

        return minNode;

        // const min = this.heap[0];
        // const lastElement = this.heap.pop();

        // if (this.heap.length > 0) {
        //     this.heap[0] = lastElement;
        //     this.heapify(0);
        // }

        // return min;
    }

    // Move the last element up to maintain the heap property
    bubbleUp() {
        let index = this.heap.length - 1;

        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);

            var leftScore = this.objScoreFunc(this.heap[index]);
            var rightScore = this.objScoreFunc(this.heap[parentIndex]);
            if (leftScore < rightScore) {
                // Swap elements if the child is smaller than the parent
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    // Heapify the subtree rooted at index to maintain the heap property
    heapify(index) {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        let smallest = index;

        var smallestScore = this.objScoreFunc(this.heap[smallest]);

        if (leftChild < this.heap.length && this.objScoreFunc(this.heap[leftChild]) < smallestScore) {
            smallest = leftChild;
        }

        if (rightChild < this.heap.length && this.objScoreFunc(this.heap[rightChild]) < smallestScore) {
            smallest = rightChild;
        }

        if (smallest !== index) {
            // Swap elements if needed
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            this.heapify(smallest);
        }
    }

    toString() {
        return this.heap.toString();
    }

}
