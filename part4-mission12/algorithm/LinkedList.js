class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addNode(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  findNode(value) {
    let curr = this.head;
    while (curr) {
      if (curr.value === value) return curr;
      curr = curr.next;
    }
    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return;

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    targetNode.next = newNode;
    if (targetNode === this.tail) this.tail = newNode;
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode || !targetNode.next) return;

    const nodeToRemove = targetNode.next;
    targetNode.next = nodeToRemove.next;
    if (nodeToRemove === this.tail) this.tail = targetNode;
  }
}

// LinkedList 테스트
const myLL = new LinkedList();
myLL.addNode(10);
myLL.addNode(20);
myLL.insertAfter(10, 15); // 10 뒤에 15 삽입
console.log('LL Find 15:', myLL.findNode(15)?.value); // 15
myLL.removeAfter(10); // 10 뒤의 15 삭제
console.log('LL After Remove:', myLL.head.next.value); // 20 (15가 지워짐)
