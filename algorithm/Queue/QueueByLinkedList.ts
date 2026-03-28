class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null;
  prev: QueueNode<T> | null;
  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}
class Q<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private length = 0;

  enqueue(value: T) {
    const newNode = new QueueNode(value);
    if (!this.tail) {
      this.head = this.tail = newNode;
    }else {
        this.tail.next = newNode
        newNode.prev = this.tail
        this.tail = newNode 
    }
    this.length ++;
  }
  dequeue():T | null{
    if (!this.head) return null
    const removed = this.head
    if (this.head === this.tail) {
        this.head = this.tail = null
    } else {
        this.head = this.head.next;
         if (this.head) this.head.prev = null;
    }
    this.length--;
    return removed.value
  }
  size(){
    return this.length;
  }
  peek():null | T{
    if (!this.head) return null;
    return this.head.value;
  }
}

const q = new Q <number>();
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);

console.log(q);
console.log(q.peek())
console.log(q.size())
console.log(q.dequeue())
console.log(q.size())
