function selectionSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    let minIndex = i;

    //최소값 탐색
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 구조 분해 할당을 통해 최소값을 '현재 위치'로 변경
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
}

const testArr = [5, 9, 12, 1, 3, 6, 8];
console.log("선택 정렬 전 : " + testArr);

selectionSort(testArr);
console.log("선택 정렬 후 : " + testArr);

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let currentVal = arr[i];
    let j = i - 1;

    // 현재 값을 정렬된 앞부분의 값들과 비교하며 뒤로 밀어냄
    while (j >= 0 && arr[j] > currentVal) {
      arr[j + 1] = arr[j];
      j--;
    }
    // 적절한 위치에 값 삽입
    arr[j + 1] = currentVal;
  }
  return arr;
}

const testArr1 = [5, 9, 12, 1, 3, 6, 8];
console.log("\n삽입 정렬 전 : " + testArr1);

insertionSort(testArr1);
console.log("삽입 정렬 후 : " + testArr1);

function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // 남은 요소들을 합침
  return [...result, ...left.slice(i), ...right.slice(j)];
}

const testArr2 = [5, 9, 12, 1, 3, 6, 8];
let result = mergeSort(testArr2);

console.log("\n병합 정렬 전 : " + testArr2);
console.log("병합 정렬 후 : " + result);

function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);

    // 피벗을 기준으로 좌우 재귀 호출
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
}

function partition(arr, left, right) {
  const pivot = arr[right]; // 마지막 요소를 피벗으로 설정
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

const testArr3 = [5, 9, 12, 1, 3, 6, 8];
console.log("\n퀵 정렬 전 : " + testArr3);

quickSort(testArr3);
console.log("퀵 정렬 후 : " + testArr3);
