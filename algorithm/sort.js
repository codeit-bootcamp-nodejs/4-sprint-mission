//선택정렬
function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      let tem = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = tem;
    }
  }

  return arr;
};

let Array1 = [5, 3, 4, 1, 2];
selectionSort(Array1);
console.log(Array1);

//삽입정렬
function insertionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let data = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > data) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = data;
  }

  return arr;
}

let Array2 = [5, 3, 4, 1, 2];
insertionSort(Array2);
console.log(Array2);

//병합 정렬
function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
}

const Array3 = [8, 4, 6, 2, 9, 1, 3, 5];
console.log(mergeSort(Array3));

//퀵 정렬
function swap(arr, i, j) {
    let tem = arr[i];
    arr[i] = arr[j];
    arr[j] = tem;
}

function partition(arr, start, end) {
    let pivot = arr[end];
    let i = start;

    for (let j = start; j < end; j++) {
        if (arr[j] < pivot) {
            swap(arr, i, j);
            i++;
        }
    }

    swap(arr, i, end);
    return i;
}

function quickSort(arr, start = 0, end = arr.length - 1) {
    if (start >= end) {
        return;
    }

    let pivotIndex = partition(arr, start, end);

    quickSort(arr, start, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, end);
}

let Array4 = [1, 8, 3, 9, 4, 5, 7];
quickSort(Array4);
console.log(Array4);

//heapify
function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

function heapsort(arr) {
  let n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}