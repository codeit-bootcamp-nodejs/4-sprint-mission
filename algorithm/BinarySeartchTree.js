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
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) { current.left = newNode; break; }
        current = current.left;
      } else {
        if (!current.right) { current.right = newNode; break; }
        current = current.right;
      }
    }
  }

  find(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
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

//테스트 코드
const list = new BinarySearchTree();
list.insert(10);
list.insert(15);
list.insert(30);
console.log(list.find(15));
list.remove(15);
console.log(list.find(15));