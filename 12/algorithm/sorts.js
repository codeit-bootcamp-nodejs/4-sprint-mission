function selectionSort(arr) {
  arr = [...arr];
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    if (i !== min) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
  return arr;
}

function insertionSort(arr) {
  arr = [...arr];
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

function mergeSort(arr) {
  let right, left;
  let mid = Math.floor(arr.length / 2);
  if (arr.length <= 1) {
    return arr;
  }
  left = mergeSort(arr.slice(0, mid));
  right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function quickSort(arr, left, right) {
  if (left < right) {
    const p = partition(arr, left, right);
    quickSort(arr, left, p - 1);
    quickSort(arr, p + 1, right);
  }
  return arr;
}
function partition(arr, left, right) {
  const pivot = arr[right]; // 마지막 요소를 피벗으로
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1; // 피벗의 최종 위치 반환
}

function heapSort(arr) {
  arr = [...arr];
  const n = arr.length;

  // max heap 생성
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 하나씩 꺼내서 뒤로 보내기
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, heapSize, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < heapSize && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < heapSize && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, heapSize, largest);
  }
}

const nums = [3, 1, 2, 5, 4];
console.log(nums);
console.log(selectionSort(nums));
console.log(insertionSort(nums));
console.log(mergeSort(nums));
console.log(quickSort(nums, 0, nums.length - 1));
console.log(heapSort(nums));
