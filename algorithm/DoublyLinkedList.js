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

  // 1. addToHead: 리스트 앞쪽에 추가
  addToHead(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
  }

  // 2. addToTail: 리스트 뒤쪽에 추가
  addToTail(value) {
    const newNode = new Node(value);
    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  // 3. findNode: 노드 찾기
  findNode(value) {
    let curr = this.head;
    while (curr) {
      if (curr.value === value) return curr;
      curr = curr.next;
    }
    return null;
  }

  // 4. insertAfter: 특정 노드 뒤에 삽입
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return;

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    newNode.prev = targetNode;

    if (targetNode.next) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode; // 마지막 노드 뒤면 tail 업데이트
    }
    targetNode.next = newNode;
  }

  // 5. removeNode: 특정 값을 가진 노드 삭제 (중요!)
  removeNode(value) {
    const nodeToRemove = this.findNode(value);
    if (!nodeToRemove) return;

    if (nodeToRemove.prev) {
      nodeToRemove.prev.next = nodeToRemove.next;
    } else {
      this.head = nodeToRemove.next; // head인 경우
    }

    if (nodeToRemove.next) {
      nodeToRemove.next.prev = nodeToRemove.prev;
    } else {
      this.tail = nodeToRemove.prev; // tail인 경우
    }
  }
}

//  이중 링크드 리스트 테스트트
const dList = new DoublyLinkedList();

dList.addToTail(10);
dList.addToTail(20);
dList.addToHead(5);
// 현재: [5] <-> [10] <-> [20]

dList.insertAfter(10, 15);
// 현재: [5] <-> [10] <-> [15] <-> [20]

console.log(dList.findNode(15).prev.value); // 10 (이전 노드 확인)
console.log(dList.findNode(15).next.value); // 20 (다음 노드 확인)

dList.removeNode(10);
// 현재: [5] <-> [15] <-> [20]
console.log(dList.findNode(15).prev.value); // 5 (10이 사라지고 5와 연결됨)
