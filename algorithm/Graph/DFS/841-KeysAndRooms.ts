function hasVisitedAllRooms(rooms:number[][]){
    const visited = new Set<number>()
    function dfs(room: number){
        if(visited.has(room))return;
        visited.add(room)

        for(let keys of rooms[room]){
            dfs(keys)
        }
    }
    dfs(0)
    return visited.size === rooms.length;
}

let result = hasVisitedAllRooms([[1],[2],[3],[]])
console.log(result)

function iterative(rooms:number[][]){
    const stack: number[] = [0]
    const seen = new Set<number>();
    
    while(stack.length > 0){
        const room = stack.pop()!
        if (seen.has(room)) continue
        seen.add(room)
        for(let key of rooms[room]){
             stack.push(key)
        }
    }
    return seen.size === rooms.length
}

let result2 = iterative([[1],[2],[3],[]])
console.log(result2)