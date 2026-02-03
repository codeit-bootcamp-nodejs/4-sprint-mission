class Stack {
    constructor() {
        this.items = [];
    }
    push(value) {
        this.items.push(value);
    }
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.pop();
    }
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
    printStack() {
        console.log('Stack:', this.items.join(' | '), '(top)');
    }
}

console.log('=== 스택 테스트 ===');
const stack = new Stack();
console.log('isEmpty:', stack.isEmpty());

stack.push(1);
stack.push(2);
stack.push(3);
stack.printStack();

console.log('peek:', stack.peek());
console.log('pop:', stack.pop());
stack.printStack();

console.log('isEmpty:', stack.isEmpty());

module.exports = Stack;