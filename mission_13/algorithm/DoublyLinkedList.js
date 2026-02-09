class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  addToHead(value) {
    // 리스트의 앞쪽에 노드 추가
    const node = new Node(value);

    if (this.size == 0) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }

    this.size++;
  }

  addToTail(value) {
    // 리스트의 뒤쪽에 노드 추가
    const node = new Node(value);

    if (this.size == 0) {
      this.tail = this.head = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.size++;    
  }

  insertAfter(targetValue, newValue) {
    // 특정 값을 가진 노드 뒤에 새 노드 추가
    const node = new Node(newValue);

    for (let n = this.head; n !== null; n = n.next) {
      if (n.value == targetValue) {
        node.next = n.next;
        n.next = node;
        node.prev = n;
        this.size++;
        break;
      }
    }
  }

  findNode(value) {
    // 값을 가진 노드를 찾아 반환합니다.
    if (this.size == 0) return null;

    for (let n = this.head; n !== null; n = n.next)
      if (n.value == value) return n;

    return null;
  }

  removeNode(value) {
    // 특정 값을 가진 노드 삭제
    for (let n = this.head; n !== null; n = n.next) {
      if (n.value == value) {
        // const [prevNode, nextNode] = [n.prev, n.next];
        const { prev: prevNode, next: nextNode } = n;
        prevNode.next = nextNode;
        nextNode.prev = prevNode;
        this.size--;
        break;
      }
    }
  }
}

class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}
