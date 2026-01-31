class Stack {
  constructor() {
    this.storage = {}; //데이터를 저장할 객체
    this.size = 0; //스택의 크기이자 다음 데이터가 들어갈 위치
  }

  //스택의 맨 위에 값을 추가
  push(value) {
    this.storage[this.size] = value;
    this.size++;
  }

  //스택의 맨 위 값을 제거하고 그 값을 리턴
  pop() {
    if (this.isEmpty()) {
      return null;
    }

    //마지막 요소를 가리키는 인덱스는 size - 1
    const lastIndex = this.size - 1;
    const removedValue = this.storage[lastIndex];

    delete this.storage[lastIndex]; //메모리 정리
    this.size--; //크기 감소

    return removedValue;
  }

  //스택의 맨 위 값을 제거하지 않고 리턴
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.storage[this.size - 1];
  }

  //스택이 비어 있는지 불린형으로 리턴
  isEmpty() {
    return this.size === 0;
  }
}

const stack = new Stack();

stack.push("첫 번째 접시");
stack.push("두 번째 접시");
stack.push("세 번째 접시");

console.log(stack.peek()); // "세 번째 접시"
console.log(stack.pop()); // "세 번째 접시"
console.log(stack.pop()); // "두 번째 접시"
console.log(stack.isEmpty()); // false
console.log(stack.pop()); // "첫 번째 접시"
console.log(stack.isEmpty()); // true
