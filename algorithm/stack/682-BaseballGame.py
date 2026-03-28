def calPoint(operations):
    stack = []
    for record in operations:
        if record == "C":
            stack.pop()

        elif record == "D":
            stack.append(stack[-1] * 2)

        elif record == "+":
            stack.append(stack[-1] + stack[-2])
        else:
            stack.append(int(record))

        return sum(stack)
    
# 파이썬은 js나 ts와 달리 sum 함수를 사용 하여 모든 배열의 정수의 합을 구할 수 있었음 
# 왜냐하면 파이썬에선 built-in 이라는 함수자체가 존재 하기 때문입니다.
