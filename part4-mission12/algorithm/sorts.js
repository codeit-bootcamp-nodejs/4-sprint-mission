function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    // 구조 분해 할당을 이용한 값 교체
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
}

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;

    // 현재 값보다 큰 값들을 오른쪽으로 한 칸씩 밀기
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
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
  // 남은 요소들을 합쳐서 반환
  return [...result, ...left.slice(i), ...right.slice(j)];
}

function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
}

function partition(arr, left, right) {
  const pivot = arr[right]; // 맨 뒤 요소를 피벗으로 설정
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

const nums = [3, 1, 2, 5, 4];

// 선택 정렬 테스트
const test1 = [...nums];
selectionSort(test1);
console.log('Selection:', test1); // [1, 2, 3, 4, 5]

// 삽입 정렬 테스트
const test2 = [...nums];
insertionSort(test2);
console.log('Insertion:', test2); // [1, 2, 3, 4, 5]

// 병합 정렬 테스트
const sortedMerge = mergeSort(nums);
console.log('Merge (New Array):', sortedMerge); // [1, 2, 3, 4, 5]
console.log('Original:', nums); // [3, 1, 2, 5, 4]

// 퀵 정렬 테스트
const test4 = [...nums];
quickSort(test4);
console.log('Quick:', test4); // [1, 2, 3, 4, 5]
