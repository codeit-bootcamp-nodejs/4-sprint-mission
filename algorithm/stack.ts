console.log("🔥 FILE EXECUTED 🔥")
class stack<T> {
  items: T[] = [];
  capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }
  peek(): T | undefined {
    console.log(1)
    if (this.items.length !== 0) {
      return this.items[this.items.length - 1];
    }
    return;
  }
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  pop(): T | undefined {
    if (this.isEmpty()) return;
    return this.items.pop();
  }
  isFull():boolean {
    return this.items.length === this.capacity
  }
  push(value: T) {
    console.log(12)
    if (this.isFull()) {
      return;
    } else {
      this.items.push(value);
    }
  }
}
  const s = new stack<number>(5)
  console.log(s.isEmpty())
  s.push(1)
  s.push(2)
  s.push(3)
  s.push(4)
  s.push(5)
  console.log(s.peek())
