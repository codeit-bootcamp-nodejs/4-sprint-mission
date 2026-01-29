function heapsort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}

function heapify(arr, size, index) {
  let largest = index;
  const left = index * 2 + 1;
  const right = index * 2 + 2;

  if (left < size && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < size && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== index) {
    [arr[index], arr[largest]] = [arr[largest], arr[index]];
    heapify(arr, size, largest);
  }
}

const arr = [4, 9, 5, 7, 1];
console.log('정렬 전:', arr);
heapsort(arr);
console.log('정렬 후:', arr);
