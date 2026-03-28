interface HListNode<T>{
    val:T;
    next: HListNode<T> | null
}

class HLinkedList<T>{
    head: HListNode<T> | null;
    tail: HListNode<T> | null
    constructor(){
        this.head = null
        this.tail = null
    }

    append(value:T){
        const newNode:HListNode<T>= {
            val:value,
            next: null
        }
        if (this.head === null){
            this.head = newNode
            this.tail = newNode
        }
    }
}
class Hash <K, V>{
    key:K;
    value:V

    constructor(size = 10){
        this.table = Array.from({ length: size }, () => new LinkedList());
    }
}