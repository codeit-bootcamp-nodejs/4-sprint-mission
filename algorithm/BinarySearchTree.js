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

  // 1. 트리에 값 추가
  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return undefined; // 중복 값은 허용하지 않음
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // 2. 주어진 값을 가진 노드 찾기
  find(value) {
    if (!this.root) return null;

    let current = this.root;
    while (current) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        return current; // 값을 찾음
      }
    }
    return null; // 찾지 못함
  }

  // 3. 트리에서 특정 값 삭제
  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
      return node;
    } else {
      // 삭제할 노드를 찾은 경우

      // Case 1: 자식이 없는 경우 (리프 노드)
      if (!node.left && !node.right) return null;

      // Case 2: 자식이 하나만 있는 경우
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: 자식이 둘 다 있는 경우
      // 오른쪽 서브트리에서 가장 작은 값(Inorder Successor)을 찾아 대체
      let tempNode = this._findMin(node.right);
      node.value = tempNode.value;
      node.right = this._removeNode(node.right, tempNode.value);
      return node;
    }
  }

  _findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}
