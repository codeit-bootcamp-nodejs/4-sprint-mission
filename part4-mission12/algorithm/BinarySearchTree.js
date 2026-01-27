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

  find(value) {
    let curr = this.root;
    while (curr) {
      if (value === curr.value) return curr;
      curr = value < curr.value ? curr.left : curr.right;
    }
    return null;
  }

  remove(value) {
    const removeNode = (node, val) => {
      if (!node) return null;
      if (val === node.value) {
        if (!node.left && !node.right) return null;
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let temp = node.right;
        while (temp.left) temp = temp.left;
        node.value = temp.value;
        node.right = removeNode(node.right, temp.value);
        return node;
      } else if (val < node.value) {
        node.left = removeNode(node.left, val);
        return node;
      } else {
        node.right = removeNode(node.right, val);
        return node;
      }
    };
    this.root = removeNode(this.root, value);
  }
}

const myBST = new BinarySearchTree();
myBST.insert(50);
myBST.insert(30);
myBST.insert(70);
myBST.insert(20);
myBST.insert(40);

console.log('BST Find 30:', myBST.find(30)?.value); // 30
console.log('BST Root Left:', myBST.root.left.value); // 30
console.log('BST Root Right:', myBST.root.right.value); // 70

myBST.remove(30); // 자식이 둘 있는 노드 삭제 테스트
console.log('BST Find 30 after remove:', myBST.find(30)); // null
