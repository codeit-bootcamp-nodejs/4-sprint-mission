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

    if (!targetNode) return false;

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    targetNode.next = newNode;

    return true;
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);

    if (!targetNode || !targetNode.next) return false;

    targetNode.next = targetNode.next.next;
    return true;
  }
}

const list = new LinkedList();
list.addNode(1);
list.addNode(2);
list.addNode(3);

list.insertAfter(2, 4); // 1 → 2 → 4 → 3
list.removeAfter(2);    // 1 → 2 → 3

console.log(list.findNode(3)); // Node { value: 3, next: null }
