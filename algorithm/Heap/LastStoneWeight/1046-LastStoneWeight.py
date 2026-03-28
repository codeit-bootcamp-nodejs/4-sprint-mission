class MaxHeap:
    def __init__(self):
        self.heap = []

    def swap(self, i, j):
        [self.heap[i], self.heap[j]] = [self.heap[j], self.heap[i]] 
    def size(self):
        return len(self.heap)
    
    def insert(self,value):
        self.heap.append(value)
        self.bubbleUp()

    def pop(self):
        if self.size()== 0 : return None
        if self.size() == 1 : return self.heap.pop()
        end = self.size() - 1
        self.swap(0, end)
        removed = self.heap.pop()
        self.bubbleDown()
        return removed
    
    def bubbleUp(self):
        idx = self.size() - 1
        while idx > 0:
            parent = (idx - 1) // 2
            if self.heap[parent] > self.heap[idx]: break
            self.swap(parent,idx)
            idx = parent

    def bubbleDown(self):
        idx = 0
        while True:
            left = 2 * idx + 1
            right = 2 * idx + 2
            largest = idx
            if left < self.size() and self.heap[largest] < self.heap[left]:
                largest = left 
            if right < self.size() and self.heap[largest] < self.heap[right]:
                largest = right 
            if largest == idx: break
            self.swap(largest,idx)
            idx = largest
        
def lastStoneWeight(stones):
    heap = MaxHeap()

    for stone in stones:
        heap.insert(stone)

    while heap.size() > 1 :
        first = heap.pop()
        second = heap.pop()
        
        if first - second != 0:
            heap.insert(first - second) 
    
    if heap.size() == 0 : 0
    else: return heap.pop()

print(lastStoneWeight(stones = [2,7,4,1,8,1]))