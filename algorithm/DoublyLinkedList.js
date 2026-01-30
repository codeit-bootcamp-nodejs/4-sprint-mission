class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  addToHead(value) {
    const newNode = new Node(value);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
  }
  addToTail(value) {
    const newNode = new Node(value);
    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  insertAfter(targetValue, newValue) {
    let iter = this.head;
    while (iter !== null) {
      if (iter.data === targetValue) {
        const newNode = new Node(newValue);
        if (iter === this.tail) {
          this.tail = newNode;
        } else {
          newNode.next = iter.next;
          iter.next.prev = newNode;
        }
        newNode.prev = iter;
        iter.next = newNode;
        return;
      }
      iter = iter.next;
    }
  }
  findNode(value) {
    let iter = this.head;
    while (iter !== null) {
      if (iter.data === value) {
        return iter;
      }
      iter = iter.next;
    }
    return null;
  }
  removeNode(value) {
    let iter = this.head;
    while (iter !== null) {
      if (iter.data === value) {
        if (this.head === this.tail) {
          this.head = null;
          this.tail = null;
        } else if (iter === this.head) {
          this.head = this.head.next;
          this.head.prev = null;
        } else if (iter === this.tail) {
          this.tail = this.tail.prev;
          this.tail.next = null;
        } else {
          iter.prev.next = iter.next;
          iter.next.prev = iter.prev;
        }
        return;
      }
      iter = iter.next;
    }
  }
  // --- 검증용 출력 함수 ---
  print() {
    let iter = this.head;
    const forward = [];
    while (iter !== null) {
      forward.push(iter.data);
      iter = iter.next;
    }

    let revIter = this.tail;
    const backward = [];
    while (revIter !== null) {
      backward.push(revIter.data);
      revIter = revIter.prev;
    }

    console.log(`Forward : [ ${forward.join(" <-> ")} ]`);
    console.log(`Backward: [ ${backward.join(" <-> ")} ]`);
    console.log(
      `Head: ${this.head?.data || "null"}, Tail: ${this.tail?.data || "null"}`
    );
    console.log("--------------------------------------------------");
  }
}

// ==========================================
// 🧪 테스트 실행 코드
// ==========================================

console.log("1. 기초 추가 테스트 (Head/Tail)");
const list = new DoublyLinkedList();
list.addToHead(2); // [2]
list.addToHead(1); // [1, 2]
list.addToTail(3); // [1, 2, 3]
list.print();
// 예상: 1 <-> 2 <-> 3

console.log("2. 중간 삽입 테스트 (2 뒤에 2.5)");
list.insertAfter(2, 2.5);
list.print();
// 예상: 1 <-> 2 <-> 2.5 <-> 3

console.log("3. 끝부분 삽입 테스트 (Tail 갱신 확인: 3 뒤에 4)");
list.insertAfter(3, 4);
list.print();
// 예상: ... 3 <-> 4 (Tail: 4)

console.log("4. Head 삭제 테스트 (1 삭제)");
list.removeNode(1);
list.print();
// 예상: Head가 2로 변경

console.log("5. Tail 삭제 테스트 (4 삭제)");
list.removeNode(4);
list.print();
// 예상: Tail이 3으로 변경

console.log("6. 중간 삭제 테스트 (2.5 삭제)");
list.removeNode(2.5);
list.print();
// 예상: 2 <-> 3

console.log("7. 남은 노드 전부 삭제 (Empty 만들기)");
list.removeNode(2);
list.removeNode(3);
list.print();
// 예상: Head: null, Tail: null
