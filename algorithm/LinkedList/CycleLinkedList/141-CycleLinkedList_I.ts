import { SinglyLinkedList } from "../SinglyLinkedList.ts"

class ListNode <T>{
    val : T;
    next:  ListNode <T> | null;

    constructor(val:T, next:ListNode <T> | null){
        this.val = val,
        this.next =  next
    }
}

function hasCycleLinkedList(head:ListNode<number> | null): boolean {
    let fast = head
    let slow = head
    while(fast && fast.next){
        slow= slow!.next
        fast = fast.next.next
        
        if(slow === fast) return true
    }
    return false
}

const myList = new SinglyLinkedList<number>()
const list = [1, 2, 3, 4];

for(let num of list){
    myList.append(num)
}

myList!.tail!.next = myList.head!.next!.next;
console.log(hasCycleLinkedList(myList.head)) 