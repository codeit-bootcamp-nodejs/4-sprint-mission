// 선택 정렬 (Selection Sort)
// 배열을 직접 수정합니다
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // 최솟값을 찾습니다
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 최솟값과 현재 위치를 교환합니다
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
}

// 삽입 정렬 (Insertion Sort)
// 배열을 직접 수정합니다
function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // key보다 큰 요소들을 한 칸씩 뒤로 이동합니다
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }
}

// 병합 정렬 (Merge Sort)
// 정렬된 새로운 배열을 리턴합니다
function mergeSort(arr) {
  // 배열의 길이가 1 이하면 이미 정렬된 상태입니다
  if (arr.length <= 1) {
    return arr;
  }

  // 배열을 반으로 나눕니다
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // 재귀적으로 정렬하고 병합합니다
  return merge(mergeSort(left), mergeSort(right));
}

// 두 개의 정렬된 배열을 병합하는 헬퍼 함수
function merge(left, right) {
  const result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // 두 배열을 비교하면서 작은 값을 결과 배열에 추가합니다
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // 남은 요소들을 추가합니다
  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// 퀵 정렬 (Quick Sort)
// 배열을 직접 수정합니다
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    // 파티션을 나누고 피벗의 최종 위치를 얻습니다
    const pivotIndex = partition(arr, left, right);

    // 피벗을 기준으로 왼쪽과 오른쪽을 재귀적으로 정렬합니다
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
}

// 배열을 파티션으로 나누는 헬퍼 함수
function partition(arr, left, right) {
  const pivot = arr[right]; // 마지막 요소를 피벗으로 선택합니다
  let i = left - 1; // 작은 요소의 인덱스

  for (let j = left; j < right; j++) {
    // 현재 요소가 피벗보다 작으면
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // 피벗을 올바른 위치에 놓습니다
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// 테스트 코드
if (require.main === module) {
  console.log('=== Selection Sort ===');
  const nums1 = [3, 1, 2, 5, 4];
  console.log('Before:', nums1);
  selectionSort(nums1);
  console.log('After:', nums1);

  console.log('\n=== Insertion Sort ===');
  const nums2 = [3, 1, 2, 5, 4];
  console.log('Before:', nums2);
  insertionSort(nums2);
  console.log('After:', nums2);

  console.log('\n=== Merge Sort ===');
  const nums3 = [3, 1, 2, 5, 4];
  console.log('Before:', nums3);
  const sorted3 = mergeSort(nums3);
  console.log('After:', sorted3);
  console.log('Original:', nums3);

  console.log('\n=== Quick Sort ===');
  const nums4 = [3, 1, 2, 5, 4];
  console.log('Before:', nums4);
  quickSort(nums4);
  console.log('After:', nums4);
}

module.exports = {
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort
};
