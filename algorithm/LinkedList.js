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

  //리스트의 끝에 새 노드 추가
  addNode(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next !== null) {
      current = current.next;
    }
    current.next = newNode;
  }

  //주어진 값을 가지는 노드 탐색
  findNode(value) {
    let current = this.head;
    while (current !== null) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }
    return null; // 값을 찾지 못한 경우
  }

  //특정 값을 가진 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    if (!targetNode) {
      console.log(`값 ${targetValue}을(를) 가진 노드를 찾을 수 없습니다.`);
      return;
    }

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    targetNode.next = newNode;
  }

  //특정 값을 가진 노드 뒤의 노드 삭제
  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);

    if (!targetNode || !targetNode.next) {
      console.log("삭제할 다음 노드가 존재하지 않습니다.");
      return;
    }

    //다음 노드를 건너뛰고 그 다음 노드에 연결
    targetNode.next = targetNode.next.next;
  }

  //리스트 구조 확인용 출력 메서드
  printList() {
    let current = this.head;
    const values = [];
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    console.log(values.join(" -> ") + " -> null");
  }
}

const list = new LinkedList();

list.addNode(10);
list.addNode(20);
list.addNode(30);
list.printList(); // 10 -> 20 -> 30 -> null

list.insertAfter(20, 25);
list.printList(); // 10 -> 20 -> 25 -> 30 -> null

list.removeAfter(25);
list.printList(); // 10 -> 20 -> 25 -> null (30이 삭제됨)
