class TNode {
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
  // 트리에 값 추가
  insert(value) {
    const newNode = new TNode(value);
    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }
  // 주어진 값을 찾고 해당 노드를 리턴
  find(value) {
    let current = this.root;
    while (current !== null) {
      if (value === current.value) {
        return current;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null;
  }
  // 트리에서 해당 값을 삭제
  remove(value) {
    const removeNode = (node, value) => {
      if (node === null) return null;

      // 왼쪽으로 내려감
      if (value < node.value) {
        node.left = removeNode(node.left, value);
        return node;
      }

      // 오른쪽으로 내려감
      if (value > node.value) {
        node.right = removeNode(node.right, value);
        return node;
      }

      // 삭제할 노드 발견 (부모 노드)
      // 자식 없음
      if (node.left === null && node.right === null) {
        return null;
      }

      // 자식 1개
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      // 자식 2개
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      node.value = successor.value;
      node.right = removeNode(node.right, successor.value);
      return node;
    };

    this.root = removeNode(this.root, value);
  }
}
