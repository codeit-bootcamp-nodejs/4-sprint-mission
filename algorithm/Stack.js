class Stack {
  constructor() {
    this.items = [];
  }

  // 1. push: 스택의 맨 위에 값을 추가
  push(value) {
    this.items.push(value);
  }

  // 2. pop: 스택의 맨 위 값을 제거하고 리턴
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  // 3. peek: 맨 위 값을 제거하지 않고 리턴
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  // 4. isEmpty: 비어 있는지 확인
  isEmpty() {
    return this.items.length === 0;
  }
}

//  스택택 테스트
const stack = new Stack();

stack.push(10);
stack.push(20);
stack.push(30);

console.log(stack.peek()); // 결과: 30 (가장 마지막에 넣은 30 확인)
console.log(stack.pop()); // 결과: 30 (30 꺼내기)
console.log(stack.peek()); // 결과: 20 (그 아래에 있던 20이 맨 위가 됨)
console.log(stack.isEmpty()); // 결과: false
