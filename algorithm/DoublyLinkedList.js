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

  //리스트의 앞쪽에 노드 추가
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

  //리스트의 뒤쪽에 노드 추가
  addToTail(value) {
    const newNode = new Node(value);
    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  //값을 가진 노드 찾아 반환
  findNode(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  //특정 값을 가진 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return console.log("대상 노드를 찾을 수 없습니다.");

    const newNode = new Node(newValue);
    newNode.next = targetNode.next;
    newNode.prev = targetNode;

    if (targetNode.next) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode; // 마지막 노드 뒤에 삽입하는 경우 tail 업데이트
    }
    targetNode.next = newNode;
  }

  //특정 값을 가진 노드 삭제
  removeNode(value) {
    const targetNode = this.findNode(value);
    if (!targetNode) return console.log("삭제할 노드가 없습니다.");

    if (targetNode === this.head) {
      this.head = targetNode.next;
      if (this.head) this.head.prev = null;
    } else if (targetNode === this.tail) {
      this.tail = targetNode.prev;
      if (this.tail) this.tail.next = null;
    } else {
      // 중간 노드 삭제 시 앞뒤를 서로 연결
      targetNode.prev.next = targetNode.next;
      targetNode.next.prev = targetNode.prev;
    }
  }

  //확인용 출력
  printAll() {
    let current = this.head;
    let result = "";
    while (current) {
      result += `${current.value} ${current.next ? "↔ " : ""}`;
      current = current.next;
    }
    console.log(result || "Empty List");
  }
}
