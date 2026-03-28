class Node:
    def __init__(self):
        self.val = None,
        self.next = None

    def hasCycle(self, head):
        if not head:
            return None
        
        fast = head
        slow = head

        while fast or fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast :
                return True
        return False