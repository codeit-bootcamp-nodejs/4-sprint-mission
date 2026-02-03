class Queue {
  constructor() {
    this.items = {}; // 데이터를 저장할 객체
    this.head = 0; // 앞쪽 포인터
    this.tail = 0; // 뒤쪽 포인터
  }

  // 1. 큐의 맨 뒤에 값을 추가
  enqueue(value) {
    this.items[this.tail] = value;
    this.tail++;
  }

  // 2. 큐의 앞에서 값을 제거하고 그 값을 리턴
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }

    const removedValue = this.items[this.head];
    delete this.items[this.head]; // 메모리 정리
    this.head++;

    // 큐가 완전히 비게 되면 포인터를 초기화 (선택 사항)
    if (this.head === this.tail) {
      this.head = 0;
      this.tail = 0;
    }

    return removedValue;
  }

  // 3. 큐의 앞에 있는 값을 제거하지 않고 리턴
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.head];
  }

  // 4. 큐가 비어 있는지 불린형으로 리턴
  isEmpty() {
    return this.tail - this.head === 0;
  }

  // 현재 큐의 크기 확인 (추가 기능)
  size() {
    return this.tail - this.head;
  }
}

// --- 사용 예시 ---
const queue = new Queue();

queue.enqueue("첫 번째");
queue.enqueue("두 번째");
queue.enqueue("세 번째");

console.log(queue.peek()); // "첫 번째"
console.log(queue.dequeue()); // "첫 번째"
console.log(queue.dequeue()); // "두 번째"
console.log(queue.isEmpty()); // false
console.log(queue.dequeue()); // "세 번째"
console.log(queue.isEmpty()); // true
