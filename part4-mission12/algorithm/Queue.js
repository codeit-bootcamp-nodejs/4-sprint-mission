class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Queue 테스트
const myQueue = new Queue();
myQueue.enqueue('1번');
myQueue.enqueue('2번');
console.log('Queue Peek:', myQueue.peek()); // "1번" (가장 오래된 거)
console.log('Queue Dequeue:', myQueue.dequeue()); // "1번" (꺼내기)
console.log('Queue After Dequeue:', myQueue.peek()); // "2번"
