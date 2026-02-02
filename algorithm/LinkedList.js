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

  // 1. addNode(value): 리스트의 끝에 새 노드를 추가
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

  // 2. findNode(value): 주어진 값을 가지는 노드를 찾아 리턴
  findNode(value) {
    let curr = this.head;
    while (curr) {
      if (curr.value === value) return curr;
      curr = curr.next;
    }
    return null;
  }

  // 3. insertAfter(targetValue, newValue): 특정 값을 가진 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return;

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    targetNode.next = newNode;

    if (targetNode === this.tail) {
      this.tail = newNode;
    }
  }

  // 4. removeAfter(targetValue): 특정 값을 가진 노드 뒤의 노드를 삭제
  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);

    if (!targetNode || !targetNode.next) return;

    const nodeToRemove = targetNode.next;
    targetNode.next = nodeToRemove.next;

    if (nodeToRemove === this.tail) {
      this.tail = targetNode;
    }
  }
}

//  링크드 리스트 테스트
const list = new LinkedList();

list.addNode(10);
list.addNode(20);
// 현재: [10] -> [20]

// 2. 특정 값 뒤에 삽입
list.insertAfter(10, 15);
// 현재: [10] -> [15] -> [20]

// 3. 노드 찾기 테스트
console.log(list.findNode(15)); // 결과: Node { value: 15, next: Node(20) }

// 4. 특정 값 뒤의 노드 삭제 (15 뒤의 20 삭제)
list.removeAfter(15);
// 현재: [10] -> [15]

// 5. 최종 상태 확인
console.log(list.findNode(20)); // 결과: null (삭제됨)
console.log(list.tail.value); // 결과: 15 (tail이 15로 잘 당겨졌는지 확인)
