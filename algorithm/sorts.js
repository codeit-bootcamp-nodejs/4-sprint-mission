// 1. 선택 정렬
function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
}

// 2. 삽입 정렬
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && key < arr[j]) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

// 3. 병합 정렬
// 새로운 배열을 반환하도록 구현
function merge(arr1, arr2) {
  const result = [];
  const len1 = arr1.length;
  const len2 = arr2.length;
  let i = 0;
  let j = 0;
  while (i < len1 && j < len2) {
    if (arr1[i] > arr2[j]) {
      result.push(arr2[j]);
      j++;
    } else {
      result.push(arr1[i]);
      i++;
    }
  }
  while (i < len1) {
    result.push(arr1[i]);
    i++;
  }
  while (j < len2) {
    result.push(arr2[j]);
    j++;
  }
  return result;
}
function mergeSort(arr) {
  const len = arr.length;
  if (len <= 1) {
    return arr;
  }
  const target = Math.floor(len / 2);
  const arr1 = mergeSort(arr.slice(0, target));
  const arr2 = mergeSort(arr.slice(target));
  return merge(arr1, arr2);
}

// 4. 퀵 정렬
function swap(arr, idx1, idx2) {
  [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
}
function partition(arr, start, end) {
  let i = start;
  let b = start;
  let p = end;
  while (p > i) {
    if (arr[p] > arr[i]) {
      swap(arr, i, b);
      b++;
    }
    i++;
  }
  swap(arr, p, b);
  p = b;
  return p;
}
function quickSort(arr, start = 0, end = null) {
  if (end === null) {
    end = arr.length - 1;
  }
  if (end - start <= 0) {
    return;
  }

  // divide
  const p = partition(arr, start, end);
  quickSort(arr, start, p - 1);
  quickSort(arr, p + 1, end);
}

// 5. 힙 정렬
function heapify(tree, index, treeLen) {
  const left = index * 2;
  const right = index * 2 + 1;

  let largest = index;

  if (index > 0 && treeLen > left && tree[left] > tree[largest]) {
    largest = left;
  }
  if (index > 0 && treeLen > right && tree[right] > tree[largest]) {
    largest = right;
  }
  if (index !== largest) {
    swap(tree, index, largest);
    heapify(tree, largest, treeLen);
  }
}
function heapsort(input) {
  const tree = [null, ...input];
  const treeLen = tree.length;

  for (let i = Math.floor((treeLen - 1) / 2); i > 0; i--) {
    // 힙은 완전 이진 트리일때만 가능하기 때문에
    // tree_len-1 / 2 보다 큰 인덱스의 값들은 자식 노드가 없는 리프 노드의 값들임 -> treeLen -1 / 2 이후는 heapify 불필요
    heapify(tree, i, treeLen);
  }

  for (let i = treeLen - 1; i > 0; i--) {
    swap(tree, 1, i);
    heapify(tree, 1, i);
  }
  return tree.slice(1);
}

// 테스트 케이스 정의
const testCases = [
  { name: "기본 정렬", input: [4, 32, 2, 1, 7] },
  { name: "역순 정렬", input: [100, 25, 3, 10, 5, 1] },
  { name: "음수/중복", input: [3, -2, 5, 0, 3, -5, 1] },
  { name: "이미 정렬됨", input: [1, 2, 3, 4, 5] },
];

// 정렬 여부 검증 함수
function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

// (Runner)
function runTest(sortName, sortFunc) {
  console.log(`\n------ [Testing: ${sortName}] ------`);

  testCases.forEach((tc, index) => {
    // 원본 배열이 변형되므로 복사본을 만들어 사용
    const copy = [...tc.input];

    // 실행 (병합 정렬은 새로운 배열을 리턴해야함)
    const result = sortFunc(copy) || copy;

    // 검증
    const passed = isSorted(result);
    const status = passed ? "✅ PASS" : "❌ FAIL";

    console.log(
      `${status} | Case ${index + 1} (${tc.name}): ${JSON.stringify(result)}`
    );
  });
}

// ==========================================
// [실행]
// ==========================================

runTest("선택 정렬 (Selection)", selectionSort);
runTest("삽입 정렬 (Insertion)", insertionSort);
runTest("병합 정렬 (Merge)", mergeSort); // 리턴값 있는 것도 자동 처리됨
runTest("퀵 정렬 (Quick)", quickSort);
runTest("힙 정렬 (Heap)", heapsort);
