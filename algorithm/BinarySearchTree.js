class TreeNode {
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
        const newNode = new TreeNode(value);

        if (!this.root) {
            this.root = newNode;
            return;
        }

        this._insertNode(this.root, newNode);
    }
    _insertNode(node, newNode) {
        if (newNode.value < node.value) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this._insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this._insertNode(node.right, newNode);
            }
        }
    }
    find(value) {
        return this._findNode(this.root, value);
    }
    _findNode(node, value) {
        if (!node) {
            return null;
        }

        if (value === node.value) {
            return node;
        }

        if (value < node.value) {
            return this._findNode(node.left, value);
        } else {
            return this._findNode(node.right, value);
        }
    }
    remove(value) {
        this.root = this._removeNode(this.root, value);
    }
    _removeNode(node, value) {
        if (!node) {
            return null;
        }
        if (value < node.value) {
            node.left = this._removeNode(node.left, value);
            return node;
        } else if (value > node.value) {
            node.right = this._removeNode(node.right, value);
            return node;
        } else {
            if (!node.left && !node.right) {
                return null;
            }
            if (!node.right) {
                return node.left;
            }
            if (!node.left) {
                return node.right;
            }
            const minRight = this._findMinNode(node.right);
            node.value = minRight.value;
            node.right = this._removeNode(node.right, minRight.value);
            return node;
        }
    }
    _findMinNode(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }
    inorderTraversal(node = this.root, result = []) {
        if (node) {
            this.inorderTraversal(node.left, result);
            result.push(node.value);
            this.inorderTraversal(node.right, result);
        }
        return result;
    }
    printTree() {
        console.log('Inorder:', this.inorderTraversal().join(', '));
    }
}

console.log('=== 이진 탐색 트리 테스트 ===');
const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);
bst.printTree();

console.log('find(40):', bst.find(40)?.value);
console.log('find(100):', bst.find(100));

bst.remove(20);
bst.printTree();

bst.remove(50);
bst.printTree();

module.exports = BinarySearchTree;