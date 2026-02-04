class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    this.items.push(value);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Stack 테스트
const myStack = new Stack();
myStack.push('A');
myStack.push('B');
console.log('Stack Peek:', myStack.peek()); // "B" (가장 최근 거)
console.log('Stack Pop:', myStack.pop()); // "B" (꺼내기)
console.log('Stack IsEmpty:', myStack.isEmpty()); // false
