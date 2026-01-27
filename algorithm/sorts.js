// 선택 정렬 (해당 배열 수정)
const selectionSort = (arr) => {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }

  return arr;
};

// 삽입 정렬 (해당 배열 수정)
const insertionSort = (arr) => {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }

  return arr;
};

// 병합 정렬 (새로운 배열 리턴)
const mergeSort = (arr) => {
  const newArr = [...arr];
  const temp = new Array(newArr.length);

  const merge = (left, mid, right) => {
    for (let i = left; i <= right; i++) temp[i] = newArr[i];

    let i = left,
      j = mid + 1,
      k = left;

    while (i <= mid && j <= right) {
      newArr[k++] = temp[i] <= temp[j] ? temp[i++] : temp[j++];
    }
    while (i <= mid) newArr[k++] = temp[i++];
  };

  const sort = (left, right) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  };

  sort(0, newArr.length - 1);
  return newArr;
};

// 퀵 정렬 (해당 배열 수정)
const quickSort = (arr, left = 0, right = arr.length - 1) => {
  if (left >= right) return arr;

  let pivot = arr[right];
  let i = left - 1;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  quickSort(arr, left, i);
  quickSort(arr, i + 2, right);

  return arr;
};

const numbers = [3, 1, 2, 5, 4];
console.log(selectionSort([...numbers]));
console.log(insertionSort([...numbers]));
console.log(mergeSort(numbers));
console.log(quickSort([...numbers]));
