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

  /** 리스트의 앞쪽에 노드 추가 */
  addToHead(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  /** 리스트의 뒤쪽에 노드 추가 */
  addToTail(value) {
    const newNode = new Node(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  /** 특정 값을 가진 노드 뒤에 새 노드 추가 */
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    if (!targetNode) {
      return;
    }

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

  /** 값을 가진 노드를 찾아 반환 */
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

  /** 특정 값을 가진 노드 삭제 */
  removeNode(value) {
    const nodeToRemove = this.findNode(value);

    if (!nodeToRemove) {
      return;
    }

    if (nodeToRemove.prev) {
      nodeToRemove.prev.next = nodeToRemove.next;
    } else {
      this.head = nodeToRemove.next;
    }

    if (nodeToRemove.next) {
      nodeToRemove.next.prev = nodeToRemove.prev;
    } else {
      this.tail = nodeToRemove.prev;
    }
  }
}

module.exports = DoublyLinkedList;
