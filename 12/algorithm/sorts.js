function selectionSort(arr) {
    arr = [...arr];
    for (let i = 0; i < arr.length-1; i++) {
        let min = i;
        for (let j = i+1; j < arr.length; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        if (i !== min) {
            [arr[i], arr[min]] = [arr[min], arr[i]];
        }
    }
    return arr;
}

function insertionSort(arr) {
    arr = [...arr];
    for(let i =1; i < arr.length; i++) {
        let key = arr[i];
        let j = i-1;
        while( j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
    return arr;
}

function mergeSort(arr) {
    let right, left;
    let mid = Math.floor(arr.length/2);
    if(arr.length <= 1) {
        return arr;
    }
    left = mergeSort(arr.slice(0, mid));
    right = mergeSort(arr.slice(mid));
    return merge(left, right);
}
function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;
    while(i < left.length && j < right.length) {
        if(left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    };
    return result.concat(left.slice(i)).concat(right.slice(j));
}

function quickSort(arr) {
    if(arr.length <= 1) return arr;
    const left = []; 
    const right = [];
    const pivot = arr[0];
    for(let i = 1; i< arr.length; i++) {
        if(arr[i] < pivot) left.push(arr[i]);
        else  right.push(arr[i]);
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}

const nums = [3,1,2,5,4];
console.log(nums);
console.log(selectionSort(nums));
console.log(insertionSort(nums));
console.log(mergeSort(nums));
console.log(quickSort(nums));