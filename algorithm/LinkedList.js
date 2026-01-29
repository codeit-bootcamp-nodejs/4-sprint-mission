class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  addNode(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode) {
      const newNode = new Node(newValue);
      newNode.next = targetNode.next;
      targetNode.next = newNode;
    }
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode && targetNode.next) {
      targetNode.next = targetNode.next.next;
    }
  }
}
