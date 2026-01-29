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
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode) {
      const newNode = new Node(newValue);
      newNode.prev = targetNode;
      newNode.next = targetNode.next;

      if (targetNode.next) {
        targetNode.next.prev = newNode;
      } else {
        this.tail = newNode;
      }
      targetNode.next = newNode;
    }
  }

  removeNode(value) {
    const nodeToDelete = this.findNode(value);
    if (!nodeToDelete) return;

    if (nodeToDelete.prev) {
      nodeToDelete.prev.next = nodeToDelete.next;
    } else {
      this.head = nodeToDelete.next;
    }

    if (nodeToDelete.next) {
      nodeToDelete.next.prev = nodeToDelete.prev;
    } else {
      this.tail = nodeToDelete.prev;
    }
  }
}
