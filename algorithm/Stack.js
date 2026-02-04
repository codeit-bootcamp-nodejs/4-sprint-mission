class Stack {
  constructor() {
    this.storage = [];
  }
  push(value) { this.storage.push(value); }
  pop() { return this.storage.pop(); }
  peek() { return this.storage[this.storage.length - 1]; }
  isEmpty() { return this.storage.length === 0; }
}

//테스트 코드
const list = new Stack();
list.push(10);
list.push(20);
list.pop();
console.log(list.peek());
console.log(list.isEmpty());