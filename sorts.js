
function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;

        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            let temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }
}

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }

        arr[j + 1] = key;
    }
}

function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);

    let sortedLeft = mergeSort(left);
    let sortedRight = mergeSort(right);

    return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i = i + 1;
        } else {
            result.push(right[j]);
            j = j + 1;
        }
    }

    while (i < left.length) {
        result.push(left[i]);
        i = i + 1;
    }

    while (j < right.length) {
        result.push(right[j]);
        j = j + 1;
    }

    return result;
}

function quickSort(arr, left, right) {
    if (left === undefined) {
        left = 0;
    }
    if (right === undefined) {
        right = arr.length - 1;
    }

    if (left < right) {
        let pivotIdx = partition(arr, left, right);
        quickSort(arr, left, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, right);
    }
}

function partition(arr, left, right) {
    let pivot = arr[right];
    let i = left - 1;

    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            i = i + 1;

            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    let temp = arr[i + 1];
    arr[i + 1] = arr[right];
    arr[right] = temp;

    return i + 1;
}

console.log("-선택 정렬-");
let nums1 = [3, 1, 2, 5, 4];
console.log("정렬 전:", nums1);
selectionSort(nums1);
console.log("정렬 후:", nums1);

console.log("\n-삽입 정렬-");
let nums2 = [3, 1, 2, 5, 4];
console.log("정렬 전:", nums2);
insertionSort(nums2);
console.log("정렬 후:", nums2);

console.log("\n-병합 정렬-");
let nums3 = [3, 1, 2, 5, 4];
console.log("정렬 전:", nums3);
let sorted3 = mergeSort(nums3);
console.log("정렬 후:", sorted3);
console.log("원본 배열:", nums3);

console.log("\n-퀵 정렬-");
let nums4 = [3, 1, 2, 5, 4];
console.log("정렬 전:", nums4);
quickSort(nums4);
console.log("정렬 후:", nums4);

function heapsort(arr) {
    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        let temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;

        heapify(arr, i, 0);
    }
}

function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        let temp = arr[i];
        arr[i] = arr[largest];
        arr[largest] = temp;

        heapify(arr, n, largest);
    }
}

console.log("\n-힙 정렬-");
let nums5 = [3, 1, 2, 5, 4];
console.log("정렬 전:", nums5);
heapsort(nums5);
console.log("정렬 후:", nums5);

