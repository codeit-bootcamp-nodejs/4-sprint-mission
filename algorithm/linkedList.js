// 1. initiate singly linked list

class SinglyLinkedList{
    constructor(){
        this.head = null
        this.tail = null
    }
    append(value){
        const newNode = {value, next: null}
        if(this.head === null){
            this.head = newNode
            this.tail = newNode
        }
        this.tail.next = newNode
        this.tail = newNode
    }

    insert(value,idx){
        const newNode = {value, next: null}
        if(idx === 0 ){
            newNode.next = this.head
            this.head = newNode
            if (!this.tail) this.tail = newNode
            return;
        }
        let prev = this.head
        let crnt = prev.next
        let crntIdx = 0
        while(prev && crntIdx < idx - 1){
            prev = prev.next
            crnt = crnt.next 
            crntIdx ++
        }
        if(!prev){
            console.log("out of bound")
            return
        };

        newNode.next = crnt
        prev.next = newNode
        if (!crnt) this.tail = newNode
    }
    insertAfter(targetValue, value){
        let prev = this.head
        let crnt = prev.next
        const newNode = {value, next: crnt}
        while(prev && prev.next !== null){
            prev = crnt
            crnt = crnt.next
            if(prev.value === targetValue){
                newNode.next = prev.next
                prev.next = newNode
                prev = prev.next
                crnt = crnt.next
            }
        }
        prev.next = newNode
    }
    deleteAtIndex(idx){
        
        if (this.head === null) 
            return; // base case
        if( idx === 0 ){
            thishead = head.next
            return;
        }
        let prev = this.head
        for (let i = 0; i < idx - 1; i++){
            if(!prev.next) return;
            prev = prev.next
        }
        if(!prev.next) return;

        prev.next = prev.next.next;
    }
}