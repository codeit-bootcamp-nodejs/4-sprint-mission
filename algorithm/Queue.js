class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  enqueue(value) {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    const dequeuedData = this.head.data;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
    }
    return dequeuedData;
  }
  peek() {
    return this.head?.data ?? null;
  }
  isEmpty() {
    return this.head === null;
  }
  //  현재 큐 상태 출력
  print() {
    let iter = this.head;
    const result = [];
    while (iter !== null) {
      result.push(iter.data);
      iter = iter.next;
    }
    console.log(
      `Queue: [ ${result.join(" -> ")} ] (Front: ${this.head?.data || "null"})`
    );
  }
}

// ==========================================
// 🧪 큐(Queue) 검증 시나리오
// ==========================================

const q = new Queue();

console.log("--- 1. 빈 큐 확인 ---");
q.print();
// 예상: Queue: [ ]
console.log("Is Empty?", q.isEmpty());
// 예상: true

console.log("\n--- 2. 데이터 3개 추가 (Enqueue) ---");
q.enqueue("자바");
q.enqueue("파이썬");
q.enqueue("자바스크립트");
q.print();
// 예상: Queue: [ 자바 -> 파이썬 -> 자바스크립트 ]
console.log("Peek(맨 앞):", q.peek());
// 예상: 자바

console.log("\n--- 3. 데이터 2개 꺼내기 (Dequeue) ---");
console.log("꺼낸 값:", q.dequeue()); // 자바
console.log("꺼낸 값:", q.dequeue()); // 파이썬
q.print();
// 예상: Queue: [ 자바스크립트 ]

console.log("\n--- 4. 싹 다 비우기 (Empty 만들기) ---");
console.log("꺼낸 값:", q.dequeue()); // 자바스크립트
q.print();
// 예상: Queue: [ ]
console.log("Is Empty?", q.isEmpty());
// 예상: true

console.log("\n--- 5. 비운 뒤 다시 추가하기 (Tail 재설정 확인) ---");
q.enqueue("새로운 데이터");
q.print();
// 예상: Queue: [ 새로운 데이터 ]
console.log("Peek:", q.peek());
// 예상: 새로운 데이터
