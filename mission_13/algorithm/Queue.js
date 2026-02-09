class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    // 큐의 맨 뒤에 값을 추가
    this.items.push(value);
  }

  dequeue() {
    // 큐의 앞에서 값을 제거하고 그 값을 리턴
    return this.items.shift();
  }

  peek() {
    // 큐의 앞에 있는 값을 제거하지 않고 리턴
    return this.items[0];
  }

  isEmpty() {
    // 큐가 비어 있는지 불린형으로 리턴
    return this.items.length === 0;
  }
}