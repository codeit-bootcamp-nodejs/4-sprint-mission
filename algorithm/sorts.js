//  선택 정렬
function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}

//  삽입 정렬
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;

    // 현재 값보다 큰 요소들을 오른쪽으로 한 칸씩 이동
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}

//  병합 정렬
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

  // 남은 요소들을 합쳐서 반환
  return [...result, ...left.slice(i), ...right.slice(j)];
}

//  퀵 정렬
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;

  const pivotIndex = partition(arr, left, right);

  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);

  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right]; // 마지막 원소를 피벗으로 설정
  let i = left;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  // 피벗을 자기 자리(i)로 이동
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}

//  힙 정렬
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

// 테스트 데이터: 무작위 숫자 배열
const getTestData = () => [64, 34, 25, 12, 22, 11, 90];

console.log("--- 1. 선택 정렬 ---");
const data1 = getTestData();
console.log("정렬 전:", data1);
selectionSort(data1); // 원본 수정
console.log("정렬 후:", data1);

console.log("\n--- 2. 삽입 정렬 ---");
const data2 = getTestData();
console.log("정렬 전:", data2);
insertionSort(data2); // 원본 수정
console.log("정렬 후:", data2);

console.log("\n--- 3. 병합 정렬 ---");
const data3 = getTestData();
console.log("정렬 전:", data3);
const sorted3 = mergeSort(data3); // 새 배열 반환
console.log("원본(유지):", data3);
console.log("결과(새 배열):", sorted3);

console.log("\n--- 4. 퀵 정렬 ---");
const data4 = getTestData();
console.log("정렬 전:", data4);
quickSort(data4); // 원본 수정
console.log("정렬 후:", data4);

console.log("\n--- 5. 힙 정렬 ---");
const data5 = getTestData();
console.log("정렬 전:", data5);
heapsort(data5); // 원본 수정
console.log("정렬 후:", data5);
