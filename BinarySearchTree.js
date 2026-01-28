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

    find(value) {
        let current = this.root;
        while (current) {
            if (value === current.value) {
                return current;
            }
            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return null;
    }

    remove(value) {
        // Helper function to find the minimum value node in a subtree
        const findMinNode = (node) => {
            while (node && node.left) {
                node = node.left;
            }
            return node;
        };

        const removeNode = (node, value) => {
            if (!node) {
                return null;
            }

            if (value < node.value) {
                node.left = removeNode(node.left, value);
                return node;
            } else if (value > node.value) {
                node.right = removeNode(node.right, value);
                return node;
            } else {
                // Node found
                // Case 1: No children
                if (!node.left && !node.right) {
                    return null;
                }
                // Case 2: One child
                if (!node.left) {
                    return node.right;
                }
                if (!node.right) {
                    return node.left;
                }
                // Case 3: Two children
                const minRight = findMinNode(node.right);
                node.value = minRight.value;
                node.right = removeNode(node.right, minRight.value);
                return node;
            }
        };

        this.root = removeNode(this.root, value);
    }
}
