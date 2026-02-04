class Queue {
  constructor() {
    this.storage = [];
  }

  enqueue(value) {
    this.storage.push(value);
  }

  dequeue() {
    if (this.isEmpty()) {
        return null;
    }
    return this.storage.shift();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.storage[0];
  }

  isEmpty() {
    return this.storage.length === 0;
  }
}

//테스트 코드
const list = new Queue();
list.enqueue(10);
list.enqueue(20);
list.dequeue();
console.log(list.peek());
console.log(list.isEmpty());