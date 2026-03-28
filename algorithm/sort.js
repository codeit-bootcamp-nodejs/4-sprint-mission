// merge sort
/* appraoch: divide and conquer
1. [7] | [3] | [1] | [2] | [8] | [6] | [4] | [9] | [5];

2. [3, 7] | [1, 2]  | [8] | [6] | [4] | [9] | [5]

3. [1, 2, 3, 7] | [6, 8] | [4, 9] | [5]

4. [1, 2, 3, 7] | [4, 6, 8, 9] | [5]

5. [1, 2, 3, 7] | [4, 5, 6, 8, 9] => o( log n )

6. [1 ,2, 3, 4, 5, 6, 7, 8, 9] =  o(n)

time complexity: o(n*logn)
space complexity: o(n)
*/

function mergeSort(nums = []) {
  let n = nums.length;
  if (n <= 1) return nums;
  const mid = Math.floor(n / 2);

  let left_nums = nums.slice(0, mid);
  let right_nums = nums.slice(mid);

  let sorted_left = mergeSort(left_nums);
  let sorted_right = mergeSort(right_nums);

  let res = [];
  let idx_l = 0;
  let idx_r = 0;

  while (idx_l < sorted_left.length || idx_r < sorted_right.length) {
    if (idx_l === sorted_left.length) {
      res.push(sorted_right[idx_r]);
      idx_r++;
      continue;
    }
    if (idx_r === sorted_right.length) {
      res.push(sorted_left[idx_l]);
      idx_l++;
      continue;
    }
    if (sorted_right[idx_r] <= sorted_left[idx_l]) {
      res.push(sorted_right[idx_r]);
      idx_r++;
    } else {
      res.push(sorted_left[idx_l]);
      idx_l++;
    }
  }
  return res;
}
console.log(mergeSort([7, 3, 1, 2, 8, 6, 4, 9, 5]));

/* insert
    ↓ : idx
    ⇣ : pivot

 time complexity  => o(n ** 2)
 space complexity => o(1) || O(n) => recursive


  ↓  ⇣
 [8, 4, 7]

if nums[pivot] < nums[idx] 
    temp = 4
    => [8, 8, 7] shift 8
    nums[pivot] = nums[idx]
    => [4, 8, 7] idx --(insert temp)

     ↓  ⇣
 [4, 8, 7]
    temp = 7
 if temp < nums[idx]
  => [2, 8, 8]

  => [4, 7, 8] insert temp
*/
function insertSort(nums){
    const n = nums.length
    for(let pIdx = 1;  pIdx < n; pIdx++){
        let temp = nums[pIdx]
        let idx = pIdx - 1
        while(idx >= 0 && temp < nums[idx]){
            nums[idx + 1] = nums[idx]
            idx--
        }
        nums[idx + 1] = temp
    }
    return nums
}

console.log(insertSort([7, 3, 1, 2, 8, 6, 4, 9, 5]))

// select sort

/*
 one of the slowest sorting algorithm =>  on**2
 1. find minimum number in the array (1 to n - 1)

 2. compare nums[0: n - 1]  and nums[i: n - 1] then switch it or not
 ↓     ⇣
[3, 5, 1, 4]
    ↓     ⇣
[1, 3, 5, 4]
       ↓  ⇣
[1, 3, 5, 4]

[1, 3, 4, 5]

=> O n**2 timecomplexity

=> O(n)

*/
function selectSort(nums){
   
    n = nums.length
    for(let i = 0; i < n; i++){
        minNum = nums[i]
        minIdx = i
        for(let j = i ; j < n; j++){
            if(nums[j] < minNum){
                minNum = nums[j]
                minIdx = j
            }
        }
        [nums[i],nums[minIdx]] = [nums[minIdx],nums[i]]
    }
    return nums
}
console.log(selectSort([7, 3, 1, 2, 8, 6, 4, 9, 5]))


// quick Sort
/*
pivot = 4
 ↓           ⇣
[7, 3, 1, 2, 4, 6, 8, 9, 5]
[][7]

    ↓        ⇣
[7, 3, 1, 2, 4, 6, 8, 9, 5]
[3][7]

       ↓     ⇣
[7, 3, 1, 2, 4, 6, 8, 9, 5]
[3, 1][7]

          ↓  ⇣
[7, 3, 1, 2, 4, 6, 8, 9, 5]
[3, 1, 2 ][7]

             ⇣  ↓ 
[7, 3, 1, 2, 4, 6, 8, 9, 5]
[3, 1, 2 ][7, 6]
             ⇣     ↓ 
[7, 3, 1, 2, 4, 6, 8, 9, 5]
[3, 1, 2][7, 6, 8]
             ⇣        ↓
[7, 3, 1, 2, 4, 6, 8, 9, 5]
[3, 1, 2][7, 6, 8, 9]
             ⇣           ↓
[7, 3, 1, 2, 4, 6, 8, 9, 5]
[3, 1, 2] [7, 6, 8, 9, 5]

pivot 1, 8
 ↓  ⇣         ↓     ⇣     
[3, 1, 2]    [7, 6, 8, 9, 5]
[][3]           [7][]
    ↓  ⇣         ↓  ⇣  
[3, 1, 2]    [7, 6, 8, 9, 5]
[2] [3]         [7, 6][]
                   ⇣  ↓
            [7, 6, 8, 9, 5]
            [7, 6] [9] 
                   ⇣  ↓
            [7, 6, 8, 9, 5]
            [7, 6] [9]
                   ⇣     ↓
            [7, 6, 8, 9, 5]
            [7, 6, 5][9]

            pivot = 6
             ↓  ⇣ 
            [7, 6, 5]
            [][7]
                ⇣  ↓ 
            [7, 6, 5]
            [5] [7] 

=> buttom up left + pivot + right

worst time complexity: o(n**2)
fastest time complexity : n log n

space complexity: o(n)
*/
function quickSort(nums=[]){
    let n = nums.length
    let mid = Math.floor(n / 2)

    let pivot = nums[mid]
    let leftNums = []
    let rightNums = []
    
    leftIdx = 0
    rightIdx = 0
    if(nums.length <= 1 ) {return nums};
    for(let i = 0; i < n; i++){
        if (i === mid) continue;
        if(nums[i] < pivot){
            leftNums.push(nums[i])
        }else{
            rightNums.push(nums[i])
        }
    }
    const l_sorted = quickSort(leftNums)
    const r_sorted = quickSort(rightNums)
    return [...l_sorted, pivot, ...r_sorted ]
}
console.log(quickSort([7, 3, 1, 2, 8, 6, 4, 9, 5]))