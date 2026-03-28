// problem defintion: 
// general case = f(x, y) = f(x - 1, y) + f(x, y - 1)
// sub case = if x === 0 or y === 0, return 1
/* approaching:
    1. memorization
    2.tabulation(bottom up) 
    3. stack
*/

// tabulation && morization
// time complexity O(m * n)
// space complexity O(m * n)
function findUniqueByTab(m: number, n: number): number {
    const dp = new Array<number>(m).fill(0).map(() => new Array(n).fill(0))

    for(let i = 0; i < m; i++ ){
        dp[i][0] = 1
    }
    for(let j = 0; j < n; j++ ){
        dp[0][j] = 1
    }
    for(let i = 1; i< m; i++ ){
        for(let j = 1; j< n; j++ ){
            dp[i][j] = dp[i - 1][j]+ dp[i][j - 1]
        }
    }
    return dp[m - 1][n - 1]
}
console.log(findUniqueByTab(7, 3))

function findUniqueByMemo(m: number, n: number): number {
    const dp = new Array(m).fill(0).map(() => new Array(n).fill(-1))
    function dfs(i:number, j: number){
        if(i === 0 || j === 0) return 1;

        if(dp[i][j] !== -1) return dp[i][j]

        dp[i][j] = dfs(i -1, j)+ dfs(i, j - 1)
        return dp[i][j]
    }
    return dfs(m-1,n-1)
}
console.log(findUniqueByMemo(7, 3))