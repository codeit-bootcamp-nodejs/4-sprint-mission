class Queue<T> {
  private items: T[] = [];
  private readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }
  isEmpty(): boolean {
    return this.items.length === 0;
  }
  isFull(): boolean {
    return this.items.length === this.capacity;
  }
  length(): number {
    return this.items.length;
  }
  enqueue(item: T): boolean {
    if (this.items.length !== this.capacity) return false;
    else {
      this.items.push(item);
      return true;
    }
  }
  dequeue(): T | undefined {
    if (this.items.length === 0) return undefined;
    return this.items.shift();
  }
}
