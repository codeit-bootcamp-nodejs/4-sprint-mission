import type { ListNode } from "./SinglyLinkedList.ts";

class DoublyLinkedList<T>{
    head: ListNode<T> | null 
    tail: ListNode<T> | null

    constructor(){
        this.head = null
        this.tail = null
    }
    append(value:T){
        const newNode : ListNode<T> = {
            val :value,
            next: null,
            prev: null
        };
        if(!this.head){
            this.head = newNode;
            this.tail = newNode;
            return
        }
        newNode.prev = this.tail
        this.tail!.next = newNode;
        this.tail = newNode;
    }
    preppend(value:T){
        const newNode : ListNode<T> = {
            val :value,
            next: null,
            prev: null
        }
        if(!this.head){
            this.head = newNode;
            this.tail = newNode;
            return ;
        }
        newNode.next = this.head;
        this.head.prev = newNode
        this.head = newNode;
    }
    insert(target:T, value:T){
        let crnt = this.head
        let prev = null
        const newNode: ListNode<T> = {
            val :value,
            next: null,
            prev: null
        }
        while(crnt){
            if(crnt.val === value){
                newNode.next = crnt.next 
                newNode.prev = crnt
                crnt = newNode.next
                return ;
            }
            crnt = crnt.next
        }
    }

}