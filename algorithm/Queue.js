class Queue {
  constructor() {
    this.items = [];
  }

  /** 큐의 맨 뒤에 값을 추가 */
  enqueue(value) {
    this.items.push(value);
  }

  /** 큐의 앞에서 값을 제거하고 그 값을 리턴 */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  /** 큐의 앞에 있는 값을 제거하지 않고 리턴 */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  /** 큐가 비어 있는지 불린형으로 리턴 */
  isEmpty() {
    return this.items.length === 0;
  }
}

module.exports = Queue;
