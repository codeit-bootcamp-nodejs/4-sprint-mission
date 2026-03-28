/*
* problem defintion: Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if:
* Open brackets must be closed by the same type of brackets.
* Open brackets must be closed in the correct order.
* time complexity: o(n)
* space complexity: o(n)
*/

function valid(s: string): boolean {
    let stack: Array<string> = [];
    const openBrackets: Array<string> = ["{", "(", "["];
    const pairs: { [key: string]: string } = { "(": ")", "{": "}", "[": "]" };
    let i: number = 0;
    while (i < s.length) {
        if (openBrackets.includes(s[i])) {
            stack.push(s[i]);
        } else {
            let last = stack.pop();
            if (!last || pairs[last] !== s[i]) return false;
        }
        i++;
    }
    return stack.length === 0;
}
console.log(valid("()"))
console.log(valid("()[]{}"))
console.log(valid("(]"))