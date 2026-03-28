def palindromNumber(x):
    if x < 0:
        return False
    original = x
   
    reversed_num= 0
    
    while x > 0:
        digit = x % 10
        reversed_num = reversed_num * 10 + digit
        x //= 10
    return reversed_num == original

print(palindromNumber(121))
print(palindromNumber(123))
print(palindromNumber(11))