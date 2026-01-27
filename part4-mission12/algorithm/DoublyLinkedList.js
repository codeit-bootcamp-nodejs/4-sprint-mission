class Node {
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
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
  }

  addToTail(value) {
    const newNode = new Node(value);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  findNode(value) {
    let curr = this.head;
    while (curr) {
      if (curr.value === value) return curr;
      curr = curr.next;
    }
    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return;

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    newNode.prev = targetNode;

    if (targetNode.next) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }
    targetNode.next = newNode;
  }

  removeNode(value) {
    const nodeToRemove = this.findNode(value);
    if (!nodeToRemove) return;

    if (nodeToRemove === this.head) {
      this.head = nodeToRemove.next;
      if (this.head) this.head.prev = null;
    } else if (nodeToRemove === this.tail) {
      this.tail = nodeToRemove.prev;
      if (this.tail) this.tail.next = null;
    } else {
      nodeToRemove.prev.next = nodeToRemove.next;
      nodeToRemove.next.prev = nodeToRemove.prev;
    }
  }
}

// DoublyLinkedList 테스트
const myDLL = new DoublyLinkedList();
myDLL.addToHead(10);
myDLL.addToTail(30);
myDLL.insertAfter(10, 20); // 10 뒤에 20 삽입
console.log('DLL Tail Prev:', myDLL.tail.prev.value); // 20
myDLL.removeNode(20);
console.log('DLL After Remove:', myDLL.head.next.value); // 3
