var Heap = /** @class */ (function () {
    function HeapByJs(compare, heap) {
        if (heap === void 0) { heap = []; }
        this.compare = compare;
        this.heap = heap;
    }
    HeapByJs.prototype.insert = function (value) {
        this.heap.push(value);
        this.heapifyUp();
    };
    HeapByJs.prototype.pop = function (start, end) {
        var n = this.heap.length;
        this.swap(start, end);
        var removed = this.heap.pop();
        this.heapifyDown(start, end);
        return removed;
    };
    HeapByJs.prototype.heapifyUp = function () {
        var idx = this.heap.length - 1;
        while (idx > 0) {
            var parentIdx = Math.floor((idx - 1) / 2);
            if (this.compare(this.heap[parentIdx], this.heap[idx]) < 0)
                break;
            this.swap(parentIdx, idx);
            idx = parentIdx;
        }
    };
    HeapByJs.prototype.heapifyDown = function (start, end) {
        while (2 * start + 1 < end) {
            var left_c = 2 * start + 1;
            var right_c = 2 * start + 2;
            var target = left_c;
            if (right_c < end &&
                this.compare(this.heap[right_c], this.heap[left_c]) < 0 //right node always bigger thatn left node 
            ) {
                target = right_c;
            }
            if (this.compare(this.heap[start], this.heap[target]) < 0)
                break;
            this.swap(start, target);
            start = target;
        }
    };
    HeapByJs.prototype.heapBuild = function () {
        for (var i = Math.floor((this.heap.length - 1) / 2); i >= 0; --i) {
            this.heapifyDown(i, this.heap.length);
        }
    };
    HeapByJs.prototype.heapSort = function () {
        var n = this.heap.length;
        this.heapBuild();
        for (var end = n - 1; end > 0; end--) {
            this.swap(0, end);
            this.heapifyDown(0, end);
        }
    };
    HeapByJs.prototype.swap = function (i, j) {
        var _a;
        _a = [this.heap[j], this.heap[i]], this.heap[i] = _a[0], this.heap[j] = _a[1];
    };
    return HeapByJs;
}());
