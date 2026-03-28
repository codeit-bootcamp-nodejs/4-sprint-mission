class MinStack:
    def __init__(self):
        self.stack = []
        self.minStack = []

    def push(self, value):
        self.stack.append(value)

        if len(self.minStack) == 0 or value <= self.getMin():
            self.minStack.append(value)

    def pop(self):
        value = self.stack.pop()
        if value == self.getMin():
            self.minStack.pop()

    def top(self):
        return self.stack[len(self.stack - 1)]
    
    def getMin(self):
        return self.minStack[len(self.minStack) - 1]