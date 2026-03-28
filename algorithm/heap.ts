export class HeapByTs<T> {
  constructor(
    private compare: (a: T, b: T) => number,
    private heap: T[] = [],
  ) {}

  insert(value: T) {
    this.heap.push(value);
    this.heapifyUp();
  }

  pop(): T | undefined {
    const n = this.heap.length;
    const end = n - 1
    this.swap(0, end);
    const removed = this.heap.pop();
    this.heapifyDown(0, end);
    return removed;
  }

  heapifyUp() {
    let idx = this.heap.length - 1
    while(idx > 0){
      const parentIdx = Math.floor((idx - 1) / 2)
      if (this.compare(this.heap[parentIdx],this.heap[idx]) < 0 ) break;
      this.swap(parentIdx, idx)
      idx = parentIdx
    }
  }
  heapifyDown(start: number, end: number) {
    while (2 * start + 1 < end) {
      let left_c = 2 * start + 1;
      let right_c = 2 * start + 2;
      let target = left_c;
      if (
        right_c < end &&
        this.compare(this.heap[right_c], this.heap[left_c]) < 0//right node always bigger thatn left node 
      ) {
        target = right_c;
      }
      if (this.compare(this.heap[start], this.heap[target]) < 0) break;
      this.swap(start, target);
      start = target;
    }
  }
  heapBuild() {
    for(let i = Math.floor((this.heap.length - 1)/ 2); i >= 0; --i){
      this.heapifyDown(i,this.heap.length)
    }
  }
  heapSort() {
    const n = this.heap.length 
    this.heapBuild()
    for(let end = n - 1; end > 0; end-- ){
       this.swap(0, end);
      this.heapifyDown(0, end);
    }
  }
  swap(i: number, j: number) {
    [this.heap[i],this.heap[j]]=[this.heap[j],this.heap[i]]
  }
}

const minHeap = new HeapByTs<number>((a, b) => a - b)
minHeap.insert(1)
minHeap.insert(2)
minHeap.insert(3)
minHeap.insert(4)

console.log(minHeap.pop());
console.log(minHeap)