class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  addNode(value) {
    // 리스트의 끝에 새 노드를 추가
    const node = new Node(value);

    if (this.size == 0) {
      this.head = node;
      this.size++;
    } else {
      let n = this.head;
      for (; n.next !== null; n = n.next);
      n.next = node;
      this.size++;
    }
  }

  findNode(value) {
    // 주어진 값을 가지는 노드를 찾아 리턴
    if (this.size == 0) return null;

    for (let n = this.head; n !== null; n = n.next) {
      if (n.value == value) return n;
    }

    return null;
  }

  insertAfter(targetValue, newValue) {
    // 특정 값을 가진 노드 뒤에 새 노드 추가
    const node = new Node(newValue);

    for (let n = this.head; n !== null; n = n.next) {
      if (n.value == targetValue) {
        node.next = n.next;
        n.next = node;
        this.size++;
        break;
      }
    }
  }

  removeAfter(targetValue) {
    // 특정 값을 가진 노드 뒤의 노드를 삭제
    for (let n = this.head; n !== null; n = n.next) {
      if (n.value == targetValue) {
        const next = n.next;
        n.next = next.next;
        this.size--;
        break;
      }
    }
  }
}

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
