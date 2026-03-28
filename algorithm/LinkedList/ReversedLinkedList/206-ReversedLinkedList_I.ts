import { SinglyLinkedList } from "../SinglyLinkedList.ts";
interface LinkedListNode<T> {
  val: T;
  next: null | LinkedListNode<T>;
}
class LinkedList<T> {
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;
  list: SinglyLinkedList<T>;

  constructor() {
    this.head = null;
    this.tail = null;
    this.list = new SinglyLinkedList<T>();
  }

  reversedLinkedList() {
    let prev = null;
    let crnt = this.list.head;
    while (crnt) {
      let next = crnt.next;
      crnt.next = prev;
      prev = crnt;
      crnt = next;
    }
    this.list.head = prev
  }
}
const nums = [1, 2, 3, 4, 5];
const list = new LinkedList<number>()
for (let num of nums) {
  list.list.append(num);
}
list.list.print()
list.reversedLinkedList()
list.list.print()

