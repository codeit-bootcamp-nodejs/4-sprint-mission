/*
힙 정렬 (Heap sort)
  숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.
*/

function heapify(arr, n, i) {
  let largest = i;
  const left = i * 2 + 1;
  const right = i * 2 + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[largest], arr[i]] = [arr[i], arr[largest]];
    heapify(arr, n, largest);
  }
}

function heapSort(arr) {
  // build a max-heap
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, arr.length, i);
  }
  
  // do sort
  for (let i = arr.length - 1; i > 0; i--) {
    // swap root node and last node
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    heapify(arr, i, 0);
  }
}

let nums = [4, 5, 3, 6, 1, 2];
/*
      4
    /   \
   5     3
  / \   /
 6   1 2
 */

console.log("--- Original array of numbers ---");
console.log(nums);

console.log("--- Heap Sort ---");
heapSort(nums);
console.log(nums);