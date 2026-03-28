def subsetIterative(nums):
    stack = [[[],0]]
    result = []
    n = len(nums)
    while len(stack) > 0:
        [path, start] = stack.pop()
        result.append(path)

        for i in range(start, n):
           crntPath = path + nums[i]
           path.append([crntPath, i + 1])

    return result

