class DoublyNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const newNode = new DoublyNode(value);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
  }

  addToTail(value) {
    const newNode = new DoublyNode(value);
    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

    insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode) {
      const newNode = new DoublyNode(newValue);
      newNode.next = targetNode.next;
      newNode.prev = targetNode;
      if (targetNode.next) {
        targetNode.next.prev = newNode;
      } else {
        this.tail = newNode;
      }
      targetNode.next = newNode;
    }
  }

  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  removeNode(value) {
    const targetNode = this.findNode(value);
    if (!targetNode) return;

    if (targetNode === this.head) this.head = targetNode.next;
    if (targetNode === this.tail) this.tail = targetNode.prev;
    if (targetNode.prev) targetNode.prev.next = targetNode.next;
    if (targetNode.next) targetNode.next.prev = targetNode.prev;
  }
}

//테스트 코드
const list = new DoublyLinkedList();
list.addToHead(10);
list.addToHead(30);
list.addToTail(20);
list.insertAfter(30, 15);
console.log(list.findNode(15));
list.removeNode(15);
console.log(list.findNode(15));