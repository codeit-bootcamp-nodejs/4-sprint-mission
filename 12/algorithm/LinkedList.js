class Node {
  constructor(value) {
    this.value = value;
    this.link = null;
  }
}

class LinkedList {
  constructor() {
    this.head = new Node(null);
    this.head.link = null;
  }
  // 리스트의 끝에 새 노드를 추가
  addNode(value) {
    let list = this.head;
    while (list.link) {
      list = list.link;
    }
    list.link = new Node(value);
  }
  // 주어진 값을 가지는 노드를 찾아 리턴
  findNode(value) {
    let list = this.head;
    while (list) {
      if (list.value === value) return list;
      list = list.link;
    }
    return null;
  }
  // 특정 값을 가진 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    let list = this.head.link;

    while (list) {
      if (list.value === targetValue) {
        const newNode = new Node(newValue);
        newNode.link = list.link;
        list.link = newNode;
        return true;
      }
      list = list.link;
    }
    return false;
  }
  // 특정 값을 가진 노드 뒤의 노드를 삭제
  removeAfter(targetValue) {
    let list = this.head.link;
    while (list) {
      if (list.value === targetValue) {
        if (list.link) {
          list.link = list.link.link;
          return true;
        }
        return false;
      }
      list = list.link;
    }
    return false;
  }
}
