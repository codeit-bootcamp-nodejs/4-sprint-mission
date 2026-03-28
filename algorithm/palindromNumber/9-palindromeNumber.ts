// Problem definition: Given an integer "x", return "true", if "x" is palindrome and "false" otherwise

// 문제 정의: 주어진 정수 x에대하여, 앞 뒤과 똑같은 정수 인지 아닌지 참과 거짓을 구하라
/* 
    Approaching:
    1. 121 / 10 = 12
    rem = 1 (121 % 10)
    reversed value = 1 ( = 121's rem)

    2. 12(121/ 10) / 10 = 1
    rem = 2 (12 % 1)
    reversed value = 2 * (10 ** 1) + 1( = 121 % 10)

    3. 1 (1 / 10)
    rem = 1
    revereed  value = 1 * (10 ** 2) + 20 + 1( = 121 % 10)
*/
function palindromeNumber(x: number): boolean {
    let reversed = 0;
    let original = x
    while(x > 0){
        let digit: number = x % 10
        x = Math.floor(x / 10) 
        reversed = reversed * 10 + digit
    }
    return (original === reversed) 
}

console.log(palindromeNumber(121))