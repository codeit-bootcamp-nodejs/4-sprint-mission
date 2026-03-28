class Node():
    def __init__(self):
        self.val: None
        self.left: None
        self.right: None

class BinaryTree():
    def __init__(self):
        self.stack = []
        self.que = []

    def insert(self, value):
        crnt = self.root
        newNode = Node(value)
        
        if not self.root:
            self.root = newNode
            return
        
        while (crnt):
            if crnt.val > newNode.val:
                if crnt.left is None :
                    # leaf node 까지 가기
                    crnt.left = newNode
                    break
                crnt = crnt.left
            else:
                if crnt.right is None:
                    crnt.right = newNode
                    break
                crnt = crnt.right
        return

    def delete(self, value):
        if not self.root:
            return 
        crnt = self.root
        parent = None
        while crnt:
            if crnt.val == value:

                # 삭제할 노드가 자식이 두개가 있는 경우 
                if crnt.left and crnt.right:
                    result = self.findSuccessor(crnt)
                    parentOfSuccessor = result.parent
                    successor = result.succesor
                    parent = crnt
                    if parentOfSuccessor.left == successor:
                        parentOfSuccessor.left = successor.right
                    else:
                        parentOfSuccessor.left = successor.right

                else:
                    # 삭제할 노드가 자식이 한개가 있는 경우 
                    child = self.root.left or self.root.right
                    if crnt.left != None:
                        parent.left = child
                    # 삭제할 노드가 자식이 리프노드인 경우
            if value < crnt.val:
                crnt = crnt.left
            else: crnt = crnt.right
        return crnt
    def find(self, value):
        if not self.root: return

        crnt = self.root
        while crnt:
            if value == crnt.val:
                return crnt.val
            elif value < crnt.val:
                crnt = crnt.left
            else: 
                crnt = crnt.right

        return crnt
    def findSuccessor(self, node):
        # 삭제할 노드에서 오른쪽 자식에서 가장 막내 증손주 찾기
        parent = node
        crnt = node.right
        while crnt.left:
            parent = crnt
            crnt = crnt.left
        return crnt, parent
    # traverse
    def preOrder(self, node):
        # NLR
        if not self.root:
            return 
        self.stack.append(node)

        while len(self.stack) > 0:
            removed = self.stack.pop()
            print(removed.val)
            if removed.right:
                self.stack.append(removed.right)
            if removed.left:
                self.stack.append(removed.left)

    def inOrder(self, node):
        # LNR
        if not node:
            return 
        
        self.stack.append(node)
        while len(self.stack) > 0 or node:
            while node:
                self.stack.append(node)
                node = node.left

            node = self.stack.pop()
            print(node.val)

            node = node.right   

    def postOrder(self):
        if not self.root:
            return 
        
        stack1 = [self.root]
        stack2 = []

        while len(stack1) > 0:
            node = stack1.pop()
            stack2.append(node)

            if node.left:
                stack1.append(node.left)
            if node.right:
                stack1.append(node.right)
            
        while len(stack2) > 0:
            node = stack2.pop()
            print(node)
