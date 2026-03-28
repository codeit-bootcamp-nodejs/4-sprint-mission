class MaxHeap<T> {
  constructor(
    private heap: T[] = [],
    private compare: (a: T, b: T) => number,
  ) {}
  size() {
    return this.heap.length;
  }
  swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
  insert(value: T) {
    this.heap.push(value);
    this.bubbleUp();
  }
  pop() {
    if (this.size() === 0) return undefined;
    if (this.size() === 1) return this.heap.pop();
    const end = this.size() - 1;
    const root = this.heap[0];
    this.swap(0, end);
    this.heap.pop();
    this.bubbleDown(0);
    return root;
  }
  bubbleDown(index: number) {
    while (true) {
        let left = 2 * index + 1
        let right = 2 * index + 2
        let crnt = index
        if (left < this.size() && this.compare(this.heap[crnt], this.heap[left]) < 0)
            crnt = left
        if(right < this.size() && this.compare(this.heap[crnt], this.heap[right]) < 0){
            crnt = right
        }
        if (crnt === index) break;
        this.swap(crnt,index)
        index = crnt
    }   
  }
  bubbleUp() {
    let index = this.size() - 1
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2)
      if (this.compare(this.heap[index], this.heap[parent]) <= 0) break
      this.swap(index, parent)
      index = parent
    }
  }
}
function lastStoneWeight(stones:number[]): number | undefined {
    const heap = new MaxHeap<number>([],(a,b) => a - b)
    for(let stone of stones){
        heap.insert(stone)
    }
    while(heap.size() > 0){
        let first = heap.pop()!
        let second = heap.pop()!
        if( first - second !== 0 ){
            heap.insert(first - second)
        }
        if(heap.size() === 0) return 0
        else return heap.pop()
    }
}

// time complexity 