/* problem defintion 
    I should keep the scores for baseball game. At the begining, I should start an emty record.

    Given an array of strings operations, where operation[i] is the i th operation I must apply to the record and one of the following:

    integer "X": record new scores
    "D":  previous scores * 2
    "C": cancel the previous scores
    "+": add prvious scores and  the previous one
    return the sum of records
*/

function calPoints(operations:string[]):number{
    const stack : number[] = [];

    for(let record of operations){
        if(record ==="C"){
            stack.pop()
        }
        else if(record === "D"){
            stack.push(stack[stack.length - 1] * 2)
        }
        else if (record === "+"){
                stack.push(stack[stack.length - 1] + stack[stack.length - 2])
        }
        else {
            stack.push(Number(record))
        }
    }
    const sum = stack.reduce((accumulator, current)=> accumulator + current, 0)
    return sum
}

/**
 * 시간 복잡도 =  
    reduce => o(n)
    stack.pop() => 1
    stack.push() => 1 
    stack.pop 과 push(append)를 n 타임 반복 => o(n)
    o(2n) => o(n)

    stack은 공간 복잡도 o(n)
 */