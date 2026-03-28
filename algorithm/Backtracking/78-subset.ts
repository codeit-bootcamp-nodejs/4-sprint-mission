function subsets(nums: number[]): number[][] {
    let stack: [number[],number][] = [[[],0]];
    let result: number[][] = [];
    const n = nums.length;
    while(stack.length > 0){
        let [path, start] = stack.pop()!;
        result.push(path)
        for(let i = start; i < n; i++){
            let crntPath = [...path, nums[i]]
            stack.push([crntPath, i + 1])
        }
    }
    return result
};

function subsetsBT(nums: number[]): number[][] {
    const result: number[][] = []
    const n: number = nums.length
    function bt(path : number[], start: number){
        result.push([...path])// 값넣기  

        for(let i = start; i < n; i++){
            path.push(nums[i]) // 선택
            bt(path, i + 1)
            path.pop() // 선택 해제
        }
    }
    bt([],0)
    return result
};

/*

* decison space
                                                   []         
                                /                  |                \
                             [1]                  [2]               [3]
                          /       \          /          \     
                       [1,2]      [1,3]                [2,3]         

                    [1, 2, 3]


stack [[[1], 1], [[2], 2],[[3], 3]]

stack.pop()
the result = [[],[3]]
stack = [[[1], 1], [[2], 2]]

stack.pop()
stack = [[], 0], [[1], 1]]
result = [[], [3], [2]]
stack.push (path + previous path)
stack = [[[1], 1], [[2,3], 3]]

stack.pop()
stack = [ [[1], 1]]
result = [[], [2], [3], [2,3]]

stack.push([[1, 2], 2], [[1, 3], 3])

stack.pop()
result = [[], [2], [3], [2, 3], [1, 3]]
 

*/ 


