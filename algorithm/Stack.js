class Stack {
  constructor() {
    this.storage = [];
  }
  push(value) { this.storage.push(value); }
  pop() { return this.storage.pop(); }
  peek() { return this.storage[this.storage.length - 1]; }
  isEmpty() { return this.storage.length === 0; }
}