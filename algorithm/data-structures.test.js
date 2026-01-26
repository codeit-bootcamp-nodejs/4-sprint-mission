const LinkedList = require('./LinkedList');
const DoublyLinkedList = require('./DoublyLinkedList');
const Queue = require('./Queue');
const Stack = require('./Stack');
const BinarySearchTree = require('./BinarySearchTree');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 자료 구조 테스트');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// ===== LinkedList 테스트 =====
console.log('\n<<<< LinkedList >>>>');
const linkedList = new LinkedList();

// addNode 테스트
linkedList.addNode(1);
linkedList.addNode(2);
linkedList.addNode(3);
const orderCheck = linkedList.head.value === 1 &&
                   linkedList.head.next.value === 2 &&
                   linkedList.head.next.next.value === 3;
console.log('addNode(1, 2, 3) - 순서 확인:', orderCheck ? '✅ 통과' : '❌ 실패');

// findNode 테스트
const found = linkedList.findNode(2);
console.log('findNode(2):', found && found.value === 2 ? '✅ 통과' : '❌ 실패');
console.log('findNode(99):', linkedList.findNode(99) === null ? '✅ 통과' : '❌ 실패');

// insertAfter 테스트
linkedList.insertAfter(2, 5);
const insertedNode = linkedList.findNode(5);
console.log('insertAfter(2, 5):', insertedNode && insertedNode.value === 5 ? '✅ 통과' : '❌ 실패');

// removeAfter 테스트
linkedList.removeAfter(2);
console.log('removeAfter(2):', linkedList.findNode(5) === null ? '✅ 통과' : '❌ 실패');

// ===== DoublyLinkedList 테스트 =====
console.log('\n<<<< DoublyLinkedList >>>>');
const doublyList = new DoublyLinkedList();

// addToHead 테스트
doublyList.addToHead(1);
doublyList.addToHead(2);
console.log('addToHead(1, 2):', doublyList.head.value === 2 ? '✅ 통과' : '❌ 실패');

// addToTail 테스트
doublyList.addToTail(3);
doublyList.addToTail(4);
console.log('addToTail(3, 4):', doublyList.tail.value === 4 ? '✅ 통과' : '❌ 실패');

// findNode 테스트
const foundDoubly = doublyList.findNode(3);
console.log('findNode(3):', foundDoubly && foundDoubly.value === 3 ? '✅ 통과' : '❌ 실패');

// insertAfter 테스트
doublyList.insertAfter(3, 5);
const insertedDoubly = doublyList.findNode(5);
console.log('insertAfter(3, 5):', insertedDoubly && insertedDoubly.value === 5 ? '✅ 통과' : '❌ 실패');

// removeNode 테스트
doublyList.removeNode(5);
console.log('removeNode(5):', doublyList.findNode(5) === null ? '✅ 통과' : '❌ 실패');

// ===== Queue 테스트 =====
console.log('\n<<<< Queue >>>>');
const queue = new Queue();

// isEmpty 테스트 (빈 큐)
console.log('isEmpty (빈 큐):', queue.isEmpty() === true ? '✅ 통과' : '❌ 실패');

// enqueue 테스트
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log('enqueue(1, 2, 3):', !queue.isEmpty() ? '✅ 통과' : '❌ 실패');

// peek 테스트
console.log('peek():', queue.peek() === 1 ? '✅ 통과' : '❌ 실패');

// dequeue 테스트
const first = queue.dequeue();
console.log('dequeue():', first === 1 ? '✅ 통과' : '❌ 실패');
console.log('dequeue 후 peek():', queue.peek() === 2 ? '✅ 통과' : '❌ 실패');

// 빈 큐에서 dequeue 테스트
const emptyQueue = new Queue();
console.log('빈 큐 dequeue():', emptyQueue.dequeue() === null ? '✅ 통과' : '❌ 실패');
console.log('빈 큐 peek():', emptyQueue.peek() === null ? '✅ 통과' : '❌ 실패');

// ===== Stack 테스트 =====
console.log('\n<<<< Stack >>>>');
const stack = new Stack();

// isEmpty 테스트 (빈 스택)
console.log('isEmpty (빈 스택):', stack.isEmpty() === true ? '✅ 통과' : '❌ 실패');

// push 테스트
stack.push(1);
stack.push(2);
stack.push(3);
console.log('push(1, 2, 3):', !stack.isEmpty() ? '✅ 통과' : '❌ 실패');

// peek 테스트
console.log('peek():', stack.peek() === 3 ? '✅ 통과' : '❌ 실패');

// pop 테스트
const top = stack.pop();
console.log('pop():', top === 3 ? '✅ 통과' : '❌ 실패');
console.log('pop 후 peek():', stack.peek() === 2 ? '✅ 통과' : '❌ 실패');

// 빈 스택에서 pop 테스트
const emptyStack = new Stack();
console.log('빈 스택 pop():', emptyStack.pop() === null ? '✅ 통과' : '❌ 실패');
console.log('빈 스택 peek():', emptyStack.peek() === null ? '✅ 통과' : '❌ 실패');

// ===== BinarySearchTree 테스트 =====
console.log('\n<<<< BinarySearchTree >>>>');
const bst = new BinarySearchTree();

// insert 테스트
bst.insert(5);
bst.insert(3);
bst.insert(7);
bst.insert(1);
bst.insert(4);
bst.insert(6);
bst.insert(9);
console.log('insert(5, 3, 7, 1, 4, 6, 9):', bst.root.value === 5 ? '✅ 통과' : '❌ 실패');

// find 테스트
const foundBst = bst.find(4);
console.log('find(4):', foundBst && foundBst.value === 4 ? '✅ 통과' : '❌ 실패');
console.log('find(99):', bst.find(99) === null ? '✅ 통과' : '❌ 실패');

// 트리 구조 확인
console.log('왼쪽 자식(3):', bst.root.left.value === 3 ? '✅ 통과' : '❌ 실패');
console.log('오른쪽 자식(7):', bst.root.right.value === 7 ? '✅ 통과' : '❌ 실패');

// remove 테스트 - 자식 없는 노드
bst.remove(1);
console.log('remove(1) - 자식 없음:', bst.find(1) === null ? '✅ 통과' : '❌ 실패');

// remove 테스트 - 자식 하나
bst.remove(7);
console.log('remove(7) - 자식 하나:', bst.find(7) === null ? '✅ 통과' : '❌ 실패');
console.log('remove 후 자식(6) 존재:', bst.find(6) !== null ? '✅ 통과' : '❌ 실패');
console.log('remove 후 자식(9) 존재:', bst.find(9) !== null ? '✅ 통과' : '❌ 실패');

// remove 테스트 - 자식 둘
bst.remove(5);
console.log('remove(5) - 자식 둘:', bst.find(5) === null ? '✅ 통과' : '❌ 실패');
console.log('remove 후 트리 유효:', bst.root !== null ? '✅ 통과' : '❌ 실패');

// remove 후 트리 구조 검증
const newRoot = bst.root.value === 6 || bst.root.value === 9;
console.log('remove 후 root 변경 확인:', newRoot ? '✅ 통과' : '❌ 실패');
console.log('remove 후 남은 노드(3) 존재:', bst.find(3) !== null ? '✅ 통과' : '❌ 실패');
console.log('remove 후 남은 노드(4) 존재:', bst.find(4) !== null ? '✅ 통과' : '❌ 실패');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ 모든 테스트 완료!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
