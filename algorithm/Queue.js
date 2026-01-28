class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(value) {
        this.items.push(value);
    }
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    printQueue() {
        console.log('Queue:', this.items.join(' <- '));
    }
}

console.log('=== 큐 테스트 ===');
const queue = new Queue();
console.log('isEmpty:', queue.isEmpty());

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.printQueue();

console.log('peek:', queue.peek());
console.log('dequeue:', queue.dequeue());
queue.printQueue();

console.log('isEmpty:', queue.isEmpty());

module.exports = Queue;