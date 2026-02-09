class Stack {
  constructor() {
    this.items = [];
  }

  push(value) {
    // 스택의 맨 위에 값을 추가
    this.items.push(value);
  }

  pop() {
    // 스택의 맨 위 값을 제거하고 그 값을 리턴
    return this.items.pop();
  }

  peek() {
    // 큐의 앞에 있는 값을 제거하지 않고 리턴
    if (this.items.length === 0) return null;
    
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    // 큐가 비어 있는지 불린형으로 리턴
    return this.items.length === 0;
  }
}