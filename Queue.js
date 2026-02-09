class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(value) {
        this.queue.push(value);
    }

    dequeue() {
        return this.queue.shift();
    }

    peek() {
        if (this.queue.length === 0) {
            return undefined;
        }
        return this.queue[0];
    }

    isEmpty() {
        return this.queue.length === 0;
    }
}
