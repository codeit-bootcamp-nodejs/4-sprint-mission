const MAX_SIZE = 100;

class Stack {
  constructor() {
    this.stack = new Array(MAX_SIZE);
    this.top = -1;
  }
  // 스택의 맨 위에 값을 추가
  push(value) {
    if (this.top >= MAX_SIZE - 1) {
      throw new Error("Stack Overflow");
    }
    this.stack[++this.top] = value;
  }
  // 스택의 맨 위 값을 제거하고 그 값을 리턴
  pop() {
    if (this.isEmpty()) {
      console.log("빈 스택");
      return null;
    }
    return this.stack[this.top--];
  }
  // 스택의 맨 위 값을 제거하지 않고 그 값을 리턴
  peek() {
    if (this.isEmpty()) {
      console.log("빈 스택");
      return null;
    }
    return this.stack[this.top];
  }
  // 스택이 비어 있는지 불린형으로 리턴
  isEmpty() {
    return this.top === -1;
  }
}
