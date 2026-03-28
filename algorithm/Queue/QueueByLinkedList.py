class ListNode:
    def __init__(self):
        self.val = None
        self.prev = None,
        self.next = None

class Queue:
    def __init__(self):
        self.head = None 
        self.tail = None

    def enqueue(self, value):
        newNode = ListNode(value)
        if not self.head:
            self.tail = self.head = newNode
            return 
        self.tail.next = newNode
        self.tail = newNode
    
    def dequeue(self):
        if not self.head:
            return None
        removed = self.head
        if self.head == self.tail:
            self.head = self.tail = None
        else: 
            self.head = self.head.next
            self.head.prev = None
        return removed


        


