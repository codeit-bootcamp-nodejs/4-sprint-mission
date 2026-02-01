class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = new Node(null);
    this.head.left = this.head;
    this.head.right = this.head;
  }
  // 리스트 앞쪽에 노드 추가
  addToHead(value) {
    const newNode = new Node(value);
    newNode.left = this.head;
    newNode.right = this.head.right;
    this.head.right.left = newNode;
    this.head.right = newNode;
  }
  // 리스트 뒤쪽에 노드 추가
  addToTail(value) {
    const newNode = new Node(value);
    newNode.right = this.head;
    newNode.left = this.head.left;
    this.head.left.right = newNode;
    this.head.left = newNode;
  }
  // 특정 값을 가진 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    for (let list = this.head.right; list !== this.head; list = list.right) {
      if (list.value === targetValue) {
        const newNode = new Node(newValue);
        newNode.left = list;
        newNode.right = list.right;
        list.right.left = newNode;
        list.right = newNode;
        return true;
      }
    }
    return false;
  }
  // 값을 가진 노드 찾아 반환
  findNode(value) {
    for (let list = this.head.right; list !== this.head; list = list.right) {
      if (list.value === value) {
        return list;
      }
    }
    return null;
  }
  // 특정 값을 가진 노드 삭제
  removeNode(value) {
    let list = this.head.right;

    while (list !== this.head) {
      if (list.value === value) {
        list.left.right = list.right;
        list.right.left = list.left;
        return true;
      }
      list = list.right;
    }
    return false;
  }
}
