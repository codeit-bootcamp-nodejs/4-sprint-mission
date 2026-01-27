// 1. 선택 정렬 (Selection Sort)
// time complexity: O(n²)
function selectionSort(arr) {
  const x = arr.length;

  for (let i = 0; i < x - 1; i++) {
    let min = i;

    // 최솟값
    for (let j = i + 1; j < x; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }

    // 최솟값과 현재 위치 교환
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
    }
  }
}

// 2. 삽입 정렬 (Insertion Sort)
// time complexity: 최선 O(n), 평균 O(n²), 최악 O(n²)
function insertionSort(arr) {
  const x = arr.length;

  for (let i = 1; i < x; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }
}

// 3. 병합 정렬 (Merge Sort)
// time complexity: O(n log n)
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

// 병합 정렬 헬퍼 함수
function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// 4. 퀵 정렬 (Quick Sort)
// time complexity: 최선 O(n log n), 평균 O(n log n), 최악 O(n²)
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
}

// 퀵 정렬 헬퍼 함수
function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// 테스트 코드
console.log('=== 선택 정렬 ===');
const nums1 = [3, 1, 2];
console.log('정렬 전:', nums1);
selectionSort(nums1);
console.log('정렬 후:', nums1);

console.log('\n=== 삽입 정렬 ===');
const nums2 = [5, 2, 4, 1, 3];
console.log('정렬 전:', nums2);
insertionSort(nums2);
console.log('정렬 후:', nums2);

console.log('\n=== 병합 정렬 ===');
const nums3 = [8, 3, 5, 4, 7, 6, 1, 2];
console.log('정렬 전:', nums3);
const sorted3 = mergeSort(nums3);
console.log('정렬 후:', sorted3);
console.log('원본 배열:', nums3);

console.log('\n=== 퀵 정렬 ===');
const nums4 = [9, 2, 5, 1, 7, 6, 3];
console.log('정렬 전:', nums4);
quickSort(nums4);
console.log('정렬 후:', nums4);
