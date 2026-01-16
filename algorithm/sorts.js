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
