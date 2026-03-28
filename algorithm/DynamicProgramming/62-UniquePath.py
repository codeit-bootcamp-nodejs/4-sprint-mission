def UniquePathByTab(m, n):
    dp = [[0 for _ in range(n)] for _ in range(m)]
    for i in range(n):
        dp[0][i] = 1
    
    for j in range(m):
        dp[j][0] = 1

    for i  in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]

def UniquePathByMemo(m, n):
    memo = [[-1 for _ in range(m)] for _ in range(n)] # 해당 경로가 방문하지 않는 경우 -1로 표시

    for i in range(n):
        memo[i][0] = 1

    for j in range(m):
        memo[0][j] = 1

    def dfs(i, j):
        if memo[i][j] == -1:
            memo[i][j] = dfs(i-1, j) + dfs(i, j-1)
        return memo[i][j]
    
    return dfs(n -1, m - 1)

print(UniquePathByMemo(7, 3))