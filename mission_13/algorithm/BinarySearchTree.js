class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    // 트리에 값 추가
    const node = new Node(value);

    if (this.root == null) {
      this.root = node;
    } else {
      let current = this.root;
      while (true) {
        if (value === current.value) return false;
        if (value < current.value) {
          if (current.left == null) {
            current.left = node;
            return true;
          }
          current = current.left;
        } else {
          if (current.right == null) {
            current.right = node;
            return true;
          }
          current = current.right;
        }
      }
    }
  }

  find(value) {
    // 주어진 값을 찾고 해당 노드를 리턴
    if (this.root == null) return undefined;
    
    let current = this.root;

    while(current) {
      if (value == current.value) return current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return undefined;
  }

  remove(value) {
    // 트리에서 해당 값을 삭제
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (node === null) {
      return null;
    }

    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
      return node;
    } else {
      // 삭제할 노드를 찾은 경우

      // 1. 자식이 없는 경우 (리프 노드)
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }

      // 2. 자식이 하나인 경우
      if (node.left === null) {
        node = node.right;
        return node;
      } else if (node.right === null) {
        node = node.left;
        return node;
      }

      // 3. 자식이 둘인 경우
      // 오른쪽 서브트리에서 가장 작은 값을 찾음 (In-order successor)
      const aux = this._findMinNode(node.right);
      node.value = aux.value;
      // 오른쪽 서브트리에서 최소값을 가진 노드를 삭제
      node.right = this._removeNode(node.right, aux.value);
      return node;
    }
  }

  _findMinNode(node) {
    if (node.left === null) {
      return node;
    } else {
      return this._findMinNode(node.left);
    }
  }
}

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
