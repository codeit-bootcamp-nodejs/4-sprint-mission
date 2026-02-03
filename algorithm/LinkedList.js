class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class LinkedList {
    constructor() {
        this.head = null;
    }
    addNode(value) {
        const newNode = new Node(value);

        if (!this.head) {
            this.head = newNode;
            return;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = newNode;
    }
    findNode(value) {
        let current = this.head;

        while (current) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }

        return null;
    }
    insertAfter(targetValue, newValue) {
        const targetNode = this.findNode(targetValue);

        if (!targetNode) {
            return;
        }

        const newNode = new Node(newValue);
        newNode.next = targetNode.next;
        targetNode.next = newNode;
    }
    removeAfter(targetValue) {
        const targetNode = this.findNode(targetValue);

        if (!targetNode || !targetNode.next) {
            return;
        }

        targetNode.next = targetNode.next.next;
    }
    printList() {
        const values = [];
        let current = this.head;

        while (current) {
            values.push(current.value);
            current = current.next;
        }

        console.log(values.join(' -> '));
    }
}

console.log('=== 링크드 리스트 테스트 ===');
const list = new LinkedList();
list.addNode(1);
list.addNode(2);
list.addNode(3);
list.printList();

console.log('findNode(2):', list.findNode(2).value);

list.insertAfter(2, 2.5);
list.printList();

list.removeAfter(2);
list.printList();

module.exports = LinkedList;