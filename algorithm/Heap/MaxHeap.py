class MaxHeap:
    def __init__(self):
        self.heap = []

    def swap(self, start, end):
        self.heap[start], self.heap[end] = self.heap[end], self.heap[start]

    def insert(self, value):
        self.heap.append(value)
        self.bubbleUp()

    def pop(self):
        end = len(self.heap) - 1
        self.swap(0, end)
        removed = self.heap.pop()
        self.bubbleDown(0)
        return removed
    
    def bubbleUp(self):
        idx = len(self.heap) - 1
        while idx > 0:
            parentId = 2 * idx
            if self.heap[parentId] < self.heap[idx]:
                self.swap(parentId, idx)
            idx = parentId
    def bubbleDown(self,idx):
        while True:
            left = (2 * idx) + 1
            right = (2 * idx) + 2
            largest = idx
            if left < len(self.heap) and self.heap[left] > self.heap[largest]:
                largest = left 

            if right < len(self.heap) and self.heap[right] > self.heap[largest]:
                largest = right

            if idx == largest:
                break
            self.swap(idx, largest)
            idx = largest
    