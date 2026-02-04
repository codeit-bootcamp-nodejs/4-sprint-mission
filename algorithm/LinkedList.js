class Node {
  constructor(data) {
    this.data = data;
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
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  findNode(value) {
    let iter = this.head;
    while (iter !== null) {
      if (value === iter.data) {
        return iter;
      }
      iter = iter.next;
    }
    return null;
  }
  insertAfter(targetValue, newValue) {
    let iter = this.head;
    while (iter !== null) {
      if (targetValue === iter.data) {
        const newNode = new Node(newValue);
        if (iter.next === null) {
          this.tail = newNode;
        } else {
          newNode.next = iter.next;
        }
        iter.next = newNode;
        return;
      }
      iter = iter.next;
    }
    // 타겟을 못 찾은 경우
    console.log(`[Error] ${targetValue}을(를) 찾을 수 없습니다.`);
    return null;
  }
  removeAfter(targetValue) {
    let iter = this.head;
    while (iter !== null) {
      if (iter.next === null) {
        return null;
      }
      if (targetValue === iter.data) {
        const removedData = iter.next.data;
        iter.next = iter.next.next;
        if (iter.next === null) {
          this.tail = iter;
        }
        return removedData;
      }
      iter = iter.next;
    }
    return null;
  }
  // (테스트용) 리스트 출력 헬퍼 함수
  print() {
    let iter = this.head;
    const result = [];
    while (iter !== null) {
      result.push(iter.data);
      iter = iter.next;
    }
    console.log(
      `List: [ ${result.join(" -> ")} ] (Head: ${
        this.head ? this.head.data : "null"
      }, Tail: ${this.tail ? this.tail.data : "null"})`
    );
  }
}

console.log("--- 1. 리스트 생성 및 추가 ---");
const list = new LinkedList();
list.addNode(10);
list.addNode(20);
list.addNode(30);
list.print();
// 예상: [ 10 -> 20 -> 30 ] (Tail: 30)

console.log("\n--- 2. 노드 찾기 ---");
const found = list.findNode(20);
console.log("findNode(20):", found ? found.data : "못 찾음");
// 예상: 20

console.log("\n--- 3. 중간 삽입 (20 뒤에 25 삽입) ---");
list.insertAfter(20, 25);
list.print();
// 예상: [ 10 -> 20 -> 25 -> 30 ] (Tail: 30)

console.log("\n--- 4. 끝부분 삽입 (30 뒤에 40 삽입) ---");
list.insertAfter(30, 40);
list.print();
// 예상: [ 10 -> 20 -> 25 -> 30 -> 40 ] (Tail: 40) <--- Tail이 40으로 바뀌어야 함

console.log("\n--- 5. 중간 삭제 (20 뒤의 25 삭제) ---");
const removed1 = list.removeAfter(20);
console.log("삭제된 값:", removed1);
list.print();
// 예상: [ 10 -> 20 -> 30 -> 40 ] (Tail: 40)

console.log("\n--- 6. 끝부분 삭제 (Tail 갱신 테스트: 30 뒤의 40 삭제) ---");
const removed2 = list.removeAfter(30);
console.log("삭제된 값:", removed2);
list.print();
// 예상: [ 10 -> 20 -> 30 ] (Tail: 30) <--- Tail이 30으로 돌아와야 함

console.log("\n--- 7. 예외 테스트: 없는 값 뒤에 삽입/삭제 ---");
list.insertAfter(999, 100); // 에러 메시지 출력 예상
console.log(list.removeAfter(30)); // 30 뒤에는 아무것도 없으므로 null 반환
list.print();
