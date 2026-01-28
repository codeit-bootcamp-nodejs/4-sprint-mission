class DoublyNode {
    constructor(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }
    addToHead(value) {
        const newNode = new DoublyNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }

        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
    }
    addToTail(value) {
        const newNode = new DoublyNode(value);

        if (!this.tail) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }

        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
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

        const newNode = new DoublyNode(newValue);
        newNode.prev = targetNode;
        newNode.next = targetNode.next;

        if (targetNode.next) {
            targetNode.next.prev = newNode;
        } else {
            this.tail = newNode;
        }

        targetNode.next = newNode;
    }
    removeNode(value) {
        const targetNode = this.findNode(value);
        if (!targetNode) {
            return;
        }
        if (targetNode.prev) {
            targetNode.prev.next = targetNode.next;
        } else {
            this.head = targetNode.next;
        }
        if (targetNode.next) {
            targetNode.next.prev = targetNode.prev;
        } else {
            this.tail = targetNode.prev;
        }
    }
    printList() {
        const values = [];
        let current = this.head;

        while (current) {
            values.push(current.value);
            current = current.next;
        }

        console.log(values.join(' <-> '));
    }
}

console.log('=== 이중 링크드 리스트 테스트 ===');
const dList = new DoublyLinkedList();
dList.addToTail(2);
dList.addToTail(3);
dList.addToHead(1);
dList.printList();

dList.insertAfter(2, 2.5);
dList.printList();

dList.removeNode(2.5);
dList.printList();

module.exports = DoublyLinkedList;