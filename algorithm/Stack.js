class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Stack {
  constructor() {
    this.head = null;
  }
  push(value) {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.head = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
  }
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    const popData = this.head.data;
    if (this.head.next !== null) {
      this.head = this.head.next;
    } else {
      this.head = null;
    }
    return popData;
  }
  peek() {
    return this.head?.data ?? null;
  }
  isEmpty() {
    return this.head === null;
  }
  print() {
    let iter = this.head;
    const result = [];
    while (iter !== null) {
      result.push(iter.data);
      iter = iter.next;
    }
    console.log(`Stack(Top -> Bottom): [ ${result.join(" -> ")} ]`);
  }
}
const stack = new Stack();

console.log("--- 1. 빈 스택 확인 ---");
stack.print();
// 예상: Stack(Top -> Bottom): [ ]
console.log("Is Empty?", stack.isEmpty());
// 예상: true

console.log("\n--- 2. 데이터 3개 Push (쌓기) ---");
stack.push(10);
stack.push(20);
stack.push(30);
stack.print();
// 예상: Stack(Top -> Bottom): [ 30 -> 20 -> 10 ]  <-- 30이 맨 위(Top)여야 함
console.log("Peek(맨 위):", stack.peek());
// 예상: 30

console.log("\n--- 3. 데이터 2개 Pop (꺼내기) ---");
console.log("꺼낸 값:", stack.pop()); // 30
console.log("꺼낸 값:", stack.pop()); // 20
stack.print();
// 예상: Stack(Top -> Bottom): [ 10 ]

console.log("\n--- 4. 싹 다 비우기 ---");
console.log("꺼낸 값:", stack.pop()); // 10
stack.print();
// 예상: Stack(Top -> Bottom): [ ]
console.log("Is Empty?", stack.isEmpty());
// 예상: true

console.log("\n--- 5. 빈 스택에서 Pop 시도 ---");
console.log("꺼낸 값:", stack.pop());
// 예상: null

console.log("\n--- 6. 다시 채우기 ---");
stack.push(100);
stack.print();
// 예상: Stack(Top -> Bottom): [ 100 ]
