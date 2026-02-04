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

  /** 트리에 값 추가 */
  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  /** 주어진 값을 찾고 해당 노드를 리턴 */
  find(value) {
    return this.findNode(this.root, value);
  }

  findNode(node, value) {
    if (!node) {
      return null;
    }

    if (value === node.value) {
      return node;
    }

    if (value < node.value) {
      return this.findNode(node.left, value);
    } else {
      return this.findNode(node.right, value);
    }
  }

  /** 트리에서 해당 값을 삭제 */
  remove(value) {
    this.root = this.removeNode(this.root, value);
  }

  removeNode(node, value) {
    if (!node) {
      return null;
    }

    if (value < node.value) {
      node.left = this.removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.removeNode(node.right, value);
      return node;
    } else {
      // 노드를 찾았을 때
      // 케이스 1: 자식이 없는 경우
      if (!node.left && !node.right) {
        return null;
      }

      // 케이스 2: 자식이 하나만 있는 경우
      if (!node.left) {
        return node.right;
      }
      if (!node.right) {
        return node.left;
      }

      // 케이스 3: 자식이 둘 다 있는 경우
      // 오른쪽 서브트리에서 최솟값을 찾음
      const minRight = this.findMinNode(node.right);
      node.value = minRight.value;
      node.right = this.removeNode(node.right, minRight.value);
      return node;
    }
  }

  findMinNode(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}

module.exports = BinarySearchTree;
