class Stack<T>{
    constructor(
        private item : T[] = []
    ){}

    append(value:T){
        this.item.push(value)
    }

    pop(){
        return this.item.pop()
    }

    peak(){
        return this.item[this.item.length - 1]
    }
    isEmty(){
        if (this.item.length === 0) return true
        else return false
    }
}