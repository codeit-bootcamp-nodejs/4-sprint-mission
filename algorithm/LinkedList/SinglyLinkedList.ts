export interface ListNode<T> {
  val: T;
  next: ListNode<T> | null;
  prev?:ListNode<T>| null;
}

export class SinglyLinkedList<T> {
  head: ListNode<T> | null;
  tail: ListNode<T> | null;
  constructor() {
    this.head = null;
    this.tail = null;
  }
  append(value: T) { // add it from the end 
    const newNode: ListNode<T> = {
      val: value,
      next: null,
    };
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  preppend(value: T) { // add 
    const newNode: ListNode<T> = {
      val: value,
      next: null,
    };
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    }
    newNode.next = this.head;
    this.head = newNode;
  }
  insert(value: T, target: T) {
    let prev = null;
    let crnt = this.head;
    const newNode: ListNode<T> = {
      val: value,
      next: null,
    };
    while (crnt) {
      if (crnt.val === target) {
        if (prev === null) {
          newNode.next = this.head;
          this.head = newNode;
        } else {
          prev.next = newNode;
          newNode.next = crnt;
        }
        return;
      }
      prev = crnt;
      crnt = crnt.next;
    }
  }
  delete(value:T) {
    let crnt = this.head;
    let prev = null;
    while(crnt){
        if(crnt.val === value){
            if(prev === null){
                this.head = crnt.next
            }else{
                prev.next = crnt.next
            }
            if(crnt === this.tail){
                this.tail =prev
            }
            crnt = crnt.next;
            continue;
        }
        prev = crnt;
        crnt = crnt.next
    }
  }
  find(value: T): T | undefined {
    let crnt = this.head
    while(crnt){
        if(crnt.val === value){
            return crnt.val
        }
        crnt = crnt.next;
    }
    return;
  }
  print() {
    let crnt = this.head;
    let result = [];

    while (crnt) {
      result.push(crnt.val);
      crnt = crnt.next;
    }

    console.log(result.join(" -> "));
  }

}
