class Queue {
  constructor() {
    this.storage = [];
  }
  enqueue(value) { this.storage.push(value); }
  dequeue() { return this.storage.shift(); }
  peek() { return this.storage[0]; }
  isEmpty() { return this.storage.length === 0; }
}