type BstNode<T> = {
  val: T | null;
  left: BstNode<T> | null;
  right: BstNode<T> | null;
};

class Bst<T> {
  constructor(
    private root: BstNode<T> | null = null,
    private compare: (a: T, b: T) => number,
    private stack : BstNode<T>[] = [],
    private queue: T[] = []
  ) {}
  insert(value: T) {
    let crnt = this.root;
    const newNode: BstNode<T> = {
      val: value,
      left: null,
      right: null,
    };
    if (!this.root) {
      this.root = newNode;
      return;
    }
    while (crnt) {
      let cmp = this.compare(value, crnt.val!);
      if (cmp < 0) {
        if (!crnt.left) {
          crnt.left = newNode;
          break;
        }
        crnt = crnt.left;
      } else if (cmp > 0) {
        if (!crnt.right) {
          crnt.right = newNode;
          break;
        }
        crnt = crnt.right;
      } else {
        break;
      }
    }
  }
  delete(value:T): BstNode<T> | null {
    let crnt = this.root
    if (!this.root) return null
    let parent = null
    while(crnt){
      let cmp = this.compare(value, crnt.val!)
      let child = crnt.left ?? crnt.right
      // 삭제할 노드 조건 분기 
      if(cmp === 0){
        // 삭제할 현재 노드가 자식이 두개가 있는 경우
        if(crnt.left && crnt.right){
          let result = this.findSuccessor(crnt)!
          let successor = result.successor
          let parentSuccessor = result.parent
          crnt.val = successor.val
          if(parentSuccessor.left === successor) parentSuccessor.left = successor.right
          if(parentSuccessor.right === successor)parentSuccessor.right = successor.right
        }else{
          // 삭제할 현재 노드가 리프 노드인 경우
          if(!parent) this.root = child

          // 삭제할 현재 노드가 하나의 자식이 있는 경우
          if(parent!.left === crnt){ // 삭제할 노드에 왼쪽자식이 있는 경우
            parent!.left =  child // 삭제할 노드 부모 왼쪽에 삭제 노드 오른쪽에서 가장 작은 자식 대체
          }else{
            parent!.right = child
          }
        }
        return this.root
      }
      parent = crnt // 이동전 저장
      if(cmp < 0) crnt = crnt.left
      else crnt = crnt.right
    }
    return this.root
  }
  find(value: T) {
    let crnt = this.root
    while(crnt){
      let cmp = this.compare(value, crnt.val!)
      if(cmp === 0){
        return crnt.val;
      }
      else if(cmp < 0){
        crnt = crnt.left
      }
      else {
        crnt = crnt.right
      }
    }
    return null
  }
  findSuccessor(node:BstNode<T>) {
    // 삭제할 노드의 오른쪽 자식에서 가장 작은 값(왼쪽) 찾기
    let parent = node
    let crnt = node.right
    if(!crnt) return null
    while(crnt!.left){
      parent = crnt
      crnt = crnt!.left
    }
    return {successor: crnt, parent}
  }

  preOrderIterative(){
    if(!this.root) return null;

    let node = this.root
    this.stack.push(node)
    while(this.stack.length > 0){
      let removed = this.stack.pop()
      console.log(removed!.val)
      if(node.left){
        this.stack.push(node.left)
      }
      else {
        this.stack.push(node.right!)
      }
    }

  }
  
  inOrderIterative(){
    if(!this.root) return null;
    let crnt = this.root
    this.stack.push(crnt)
    while(this.stack.length > 0 || crnt){
      while(crnt){
        this.stack.push(crnt)
        crnt = crnt.left!
      }
      let node = this.stack.pop()
      console.log(node!.val)
      crnt = node!.right!
    }
  }

  postOrderIterative(){
    if(!this.root) return null;
    const stack1:(BstNode<T> | undefined)[] = [this.root]
    const stack2: (BstNode<T> | undefined)[] = []

    while(stack1.length > 0){
      const node = stack1.pop()!
      stack2.push(node);
      
      if(node.left) stack1.push(node.left)
      
      if (node.right) stack1.push(node.right);
    }
    while(stack2.length > 0){
      const node = stack2.pop()
      console.log(node)
    }
  }

  levelOrderIterative(){}
}