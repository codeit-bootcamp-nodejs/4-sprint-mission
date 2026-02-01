class Node {
  constructor(value) {
    this.value = value;
    this.link = null;
  }
}

class Queue {
  constructor() {
    this.front = null;
    this.rear = null;
  }
  // 큐의 맨 뒤에 값을 추가
  enqueue(value) {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.front = this.rear = newNode;
    } else {
      this.rear.link = newNode;
      this.rear = newNode;
    }
  }
  // 큐의 앞에서 값을 제거하고 그 값을 리턴
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const item = this.front.value;
    this.front = this.front.link;

    if (this.front === null) {
      this.rear = null;
    }
    return item;
  }
  // 큐의 앞에 있는 값을 제거하지 않고 리턴
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.front.value;
  }
  // 큐가 비어 있는지 불린형으로 리턴
  isEmpty() {
    return this.front === null;
  }
}
