class MinStack<T>{

    constructor(
        private stack: T[] = [],
        private minStack: T[] = []
    ){}

    push(value:T){
        this.stack.push(value)
        if(this.stack.length === 0 || value <= this.getMin()){
            this.minStack.push(value)
        }
    }

    pop(){
        const value = this.stack.pop()
        if(value === this.getMin){
            this.minStack.pop()
        }
    }

    top(){
        return this.stack[this.stack.length - 1]
    }

    getMin(){
        return this.minStack[this.minStack.length - 1]
    }
}
//  O(1) SC
//  O(n) TC