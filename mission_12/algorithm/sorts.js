/*
  선택 정렬 (Selection sort)
  숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.

  삽입 정렬 (Insertion sort)
  숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.

  병합 정렬 (Merge sort)
  숫자형 배열을 파라미터로 받고, 정렬된 새로운 배열을 리턴하도록 구현합니다.

  퀵 정렬 (Quick sort)
  숫자형 배열을 파라미터로 받고, 해당 배열을 수정하도록 구현합니다.
*/

// 선택 정렬 (Selection sort)
function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i; j < arr.length; j++) {
      if (arr[minIdx] > arr[j]) minIdx = j;
    }

    const tmp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = tmp;
  }
}

// 삽입 정렬 (Insertion sort)
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
 }
}

// 병합 정렬 (Merge sort)
function mergeSort(arr) {
  function _mergeSort(arr, left, right) {
    if (left == right) {
      const newArr = [];
      newArr.push(arr[left]);

      return newArr;
    }

    const mid = Math.ceil((left + right) / 2 - 1);

    const l = _mergeSort(arr, left, mid);
    const r = _mergeSort(arr, mid + 1, right);

    const mergedArr = [];
    let i = 0,
      j = 0;

    while (i < l.length || j < r.length) {
      if (l[i] <= r[j]) {
        if (i >= l.length) {
          mergedArr.push(r[j]);
          j++;
          continue;
        }
        mergedArr.push(l[i]);
        i++;
      } else {
        if (j >= r.length) {
          mergedArr.push(l[i]);
          i++;
          continue;
        }
        mergedArr.push(r[j]);
        j++;
      }
    }

    return mergedArr;
  }

  return _mergeSort(arr, 0, arr.length - 1);
}

// 퀵 정렬 (Quick sort)
function quickSort(arr, left, right) {
  if (left >= right) return;

  const pivot = arr[left];
  let low = left + 1,
    high = right;

  while (low <= high) {
    if (arr[low] <= pivot) {
      low++;
      continue;
    }

    if (pivot < arr[high]) {
      high--;
      continue;
    }

    const tmp = arr[low];
    arr[low] = arr[high];
    arr[high] = tmp;
  }

  arr[left] = arr[high];
  arr[high] = pivot;

  quickSort(arr, left, high - 1);
  quickSort(arr, high + 1, right);
}

let nums = [4, 5, 3, 1, 2];

console.log("--- Original array of numbers ---");
console.log(nums);

console.log("--- Selection Sort ---");
nums = [4, 5, 3, 1, 2];
selectionSort(nums);
console.log(nums);

console.log("--- Insertion Sort ---");
nums = [4, 5, 3, 1, 2];
insertionSort(nums);
console.log(nums);

console.log("--- Merge Sort ---");
nums = [4, 5, 3, 1, 2];
console.log(mergeSort(nums));

console.log("--- Quick Sort ---");
nums = [4, 5, 3, 1, 2];
quickSort(nums, 0, nums.length - 1);
console.log(nums);
