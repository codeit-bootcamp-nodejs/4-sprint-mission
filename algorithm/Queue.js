class Queue {
  constructor() {
    this.items = [];
  }

  // 1. enqueue: 큐의 맨 뒤에 값을 추가
  enqueue(value) {
    this.items.push(value);
  }

  // 2. dequeue: 큐의 앞에서 값을 제거하고 리턴
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  // 3. peek: 큐의 맨 앞의 값을 제거하지 않고 확인
  peek() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  // 4. isEmpty: 비어있는지 확인
  isEmpty() {
    return this.items.length === 0;
  }
}

//  큐 테스트트
const queue = new Queue();

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

console.log(queue.peek()); // 결과: 10 (맨 앞 확인)
console.log(queue.dequeue()); // 결과: 10 (맨 앞 제거 및 리턴)
console.log(queue.peek()); // 결과: 20 (그 다음 값인 20이 맨 앞으로 옴)
console.log(queue.isEmpty()); // 결과: false
