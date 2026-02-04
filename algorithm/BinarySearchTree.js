class Node {
  constructor(data) {
    this.data = data;
    this.parent = null;
    this.leftChild = null;
    this.rightChild = null;
  }
}
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      return;
    }
    let iter = this.root;
    while (true) {
      if (iter.data > newNode.data) {
        if (iter.leftChild === null) {
          iter.leftChild = newNode;
          break;
        }
        iter = iter.leftChild;
      } else {
        if (iter.rightChild === null) {
          iter.rightChild = newNode;
          break;
        }
        iter = iter.rightChild;
      }
    }
    newNode.parent = iter;
  }
  find(value) {
    let iter = this.root;
    while (iter != null) {
      if (iter.data === value) {
        return iter;
      } else if (iter.data > value) {
        iter = iter.leftChild;
      } else {
        iter = iter.rightChild;
      }
    }
    return null;
  }
  find_min(tree) {
    let iter = tree;
    if (!iter.leftChild && !iter.rightChild) {
      return iter;
    } else if (iter.leftChild) {
      while (iter.leftChild !== null) {
        iter = iter.leftChild;
      }
    }
    return iter;
  }
  remove(value) {
    const targetNode = this.find(value);
    const parentNode = targetNode.parent;

    if (!targetNode) {
      return;
    }

    // 1. 삭제하려는 노드가 리프 노드인 경우
    if (!targetNode.leftChild && !targetNode.rightChild) {
      // 루트인 경우
      if (targetNode === this.root) {
        this.root = null;
      } else if (targetNode === parentNode.leftChild) {
        parentNode.leftChild = null;
      } else {
        parentNode.rightChild = null;
      }
      // 2. 삭제하려는 노드가 자식이 둘 다 있는 경우
    } else if (targetNode.leftChild && targetNode.rightChild) {
      const successor = this.find_min(targetNode.rightChild);
      targetNode.data = successor.data;
      if (successor === successor.parent.leftChild) {
        successor.parent.leftChild = successor.rightChild;
      } else {
        successor.parent.rightChild = successor.rightChild;
      }
      if (successor.rightChild) {
        successor.rightChild.parent = successor.parent;
      }
      // 3. 삭제하려는 노드가 자식이 하나인 경우
    } else {
      const child = targetNode.leftChild || targetNode.rightChild;

      if (targetNode === this.root) {
        this.root = child;
        child.parent = null;
        return;
      }
      if (targetNode === parentNode.leftChild) {
        parentNode.leftChild = child;
      } else {
        parentNode.rightChild = child;
      }
      child.parent = parentNode;
    }
  }
}

// 트리 구조 출력 헬퍼
function printTreeStructure(node, prefix = "", isLeft = true) {
  if (node === null) return;
  if (node.rightChild) {
    printTreeStructure(
      node.rightChild,
      prefix + (isLeft ? "│   " : "    "),
      false
    );
  }
  console.log(prefix + (isLeft ? "└── " : "┌── ") + node.data);
  if (node.leftChild) {
    printTreeStructure(
      node.leftChild,
      prefix + (isLeft ? "    " : "│   "),
      true
    );
  }
}

// 2. 부모-자식 관계 무결성 검사
function validateIntegrity(node) {
  if (!node) return true;

  // 왼쪽 자식 검사
  if (node.leftChild) {
    if (node.leftChild.parent !== node) {
      console.error(
        `❌ [ERROR] Node ${node.leftChild.data}의 부모가 ${node.data}가 아닙니다!`
      );
      return false;
    }
    if (!validateIntegrity(node.leftChild)) return false;
  }

  // 오른쪽 자식 검사
  if (node.rightChild) {
    if (node.rightChild.parent !== node) {
      console.error(
        `❌ [ERROR] Node ${node.rightChild.data}의 부모가 ${node.data}가 아닙니다!`
      );
      return false;
    }
    if (!validateIntegrity(node.rightChild)) return false;
  }

  return true;
}

// 3. 정렬 상태 확인 (In-order Traversal)
function getSortedArray(bst) {
  const res = [];
  function traverse(node) {
    if (!node) return;
    traverse(node.leftChild);
    res.push(node.data);
    traverse(node.rightChild);
  }
  traverse(bst.root);
  return res;
}

const bst = new BinarySearchTree();

console.log("🟦 1. 트리 생성 및 데이터 삽입");
/*
      10
     /  \
    5    15
   / \   / \
  2   7 12  20
       /
      11
*/
const inputData = [10, 5, 15, 2, 7, 12, 20, 11];
inputData.forEach((v) => bst.insert(v));

printTreeStructure(bst.root);
console.log("정렬 결과:", getSortedArray(bst));
console.log(
  "무결성 검사:",
  validateIntegrity(bst.root) ? "✅ PASS" : "❌ FAIL"
);

console.log("\n🟦 2. 리프 노드 삭제 (Case 1: 2 삭제)");
bst.remove(2);
printTreeStructure(bst.root);
console.log("정렬 결과:", getSortedArray(bst)); // [5, 7, 10, 11, 12, 15, 20]

console.log(
  "\n🟦 3. 자식이 하나인 노드 삭제 (Case 3: 12 삭제 -> 11이 올라와야 함)"
);
bst.remove(12);
// 12가 사라지고 11이 15의 왼쪽 자식이 되어야 함
printTreeStructure(bst.root);
console.log("정렬 결과:", getSortedArray(bst)); // [5, 7, 10, 11, 15, 20]
console.log(
  "무결성 검사:",
  validateIntegrity(bst.root) ? "✅ PASS" : "❌ FAIL"
);

console.log(
  "\n🟦 4. 자식이 둘인 노드 삭제 (Case 2: 5 삭제 -> Successor 7 선택)"
);
bst.remove(5);
// 5 자리에 7이 가고, 원래 7 자리는 빔
printTreeStructure(bst.root);
console.log("정렬 결과:", getSortedArray(bst)); // [7, 10, 11, 15, 20]
console.log(
  "무결성 검사:",
  validateIntegrity(bst.root) ? "✅ PASS" : "❌ FAIL"
);

console.log(
  "\n🟦 5. [엣지 케이스] 자식이 하나인 루트 삭제 (루트 10 삭제 -> 15가 루트가 됨)"
);
// 현재 트리 상태: 10(Root) -> Left:7, Right:15(...)
// 테스트를 위해 왼쪽을 다 지워서 '자식이 하나(오른쪽)인 루트' 상황을 만듦
bst.remove(7);
console.log("-> (상황 설정: 루트 10은 오른쪽 자식 15만 가진 상태)");

// 실제 테스트
bst.remove(10);

printTreeStructure(bst.root);
console.log(`새로운 루트: ${bst.root ? bst.root.data : "없음"}`); // 15여야 함
console.log("정렬 결과:", getSortedArray(bst));
console.log(
  "부모 연결 확인:",
  bst.root && bst.root.parent === null
    ? "✅ PASS (Root Parent is null)"
    : "❌ FAIL"
);
console.log(
  "무결성 검사:",
  validateIntegrity(bst.root) ? "✅ PASS" : "❌ FAIL"
);
