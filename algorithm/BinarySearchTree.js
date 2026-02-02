class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // 1. insert(value): 트리에 값 추가
  insert(value) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let curr = this.root;
    while (true) {
      if (value < curr.value) {
        if (!curr.left) {
          curr.left = newNode;
          break;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          break;
        }
        curr = curr.right;
      }
    }
  }

  // 2. find(value): 값을 찾고 해당 노드 리턴
  find(value) {
    let curr = this.root;
    while (curr) {
      if (curr.value === value) return curr;
      curr = value < curr.value ? curr.left : curr.right;
    }
    return null;
  }

  // 3. remove(value): 트리에서 값 삭제
  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  // 삭제를 돕는 재귀 함수
  _removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
    } else {
      // 삭제할 노드를 찾은 경우

      // 케이스 1 & 2: 자식이 없거나 하나만 있는 경우
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // 케이스 3: 자식이 둘인 경우
      // 오른쪽 서브트리에서 가장 작은 값(Successor)을 찾아 현재 노드에 덮어씌움
      let minNode = this._findMin(node.right);
      node.value = minNode.value;
      // 대체한 값을 오른쪽 서브트리에서 삭제
      node.right = this._removeNode(node.right, minNode.value);
    }
    return node;
  }

  _findMin(node) {
    while (node.left) node = node.left;
    return node;
  }
}

//  이진 탐색 트리 테스트
const bst = new BinarySearchTree();

bst.insert(20);
bst.insert(10);
bst.insert(30);
bst.insert(25);

console.log(bst.find(30).value); // 30
bst.remove(30);
console.log(bst.find(30)); // null (삭제 확인)
console.log(bst.root.right.value); // 25 (30의 자식이었던 25가 위로 올라옴)
