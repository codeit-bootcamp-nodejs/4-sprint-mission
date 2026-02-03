class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const newNode = new Node(value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  addToTail(value) {
    const newNode = new Node(value);

    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode === null) return false;

    const newNode = new Node(newValue);
    newNode.prev = targetNode;
    newNode.next = targetNode.next;

    if (targetNode.next !== null) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    targetNode.next = newNode;
    return true;
  }

  findNode(value) {
    let current = this.head;

    while (current !== null) {
      if (current.value === value) return current;
      current = current.next;
    }

    return null;
  }

  removeNode(value) {
    const targetNode = this.findNode(value);
    if (targetNode === null) return false;

    if (targetNode.prev !== null) {
      targetNode.prev.next = targetNode.next;
    } else {
      this.head = targetNode.next;
    }

    if (targetNode.next !== null) {
      targetNode.next.prev = targetNode.prev;
    } else {
      this.tail = targetNode.prev;
    }

    return true;
  }
}

const list = new DoublyLinkedList();

list.addToHead(1);
list.addToTail(2);
list.addToTail(3);

list.insertAfter(2, 4);

console.log(list.findNode(2));

list.removeNode(4);

console.log(list.findNode(2));