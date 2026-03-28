class Node:
    def __init__(self):
        self.val = None,
        self.next = None


class LinkedList:
    def reversedLinkedList(self, head):
        if not head:
            return None
        
        crnt = head
        prev = None
        while crnt:
            node = crnt.next
            crnt.next = prev
            prev = crnt
            crnt = node

        return prev
    