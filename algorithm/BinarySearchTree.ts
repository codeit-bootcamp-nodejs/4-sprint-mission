type BSTNode<T> = {
  val: T;
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;
};

class BinarySearchTree<T> {
  private root: BSTNode<T> | null = null;
  constructor(private compare: (a: T, b: T) => number) {}
  insert(value: T): void {
    if (!this.root) {
      this.root = { val: value, left: null, right: null };
      return;
    }
    let current: BSTNode<T> | null = this.root;
    let parent: BSTNode<T> | null = null;
    while (current !== null) {
      parent = current;
      if (value < current.val) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    if (value < parent!.val) {
      parent!.left = { val: value, left: null, right: null };
    } else {
      parent!.right = { val: value, left: null, right: null };
    }
  }
  find(targetValue: T) {
    if (!this.root) {
      return;
    }
    let crnt = this.root;
    while (crnt) {
      const comparator = this.compare(targetValue, crnt.val);
      if (comparator === 0) return crnt.val;
      else if (comparator < 0) crnt = crnt.left!;
      else crnt = crnt.right!;
    }
    return null;
  }
  remove(target: T) {
    if (!this.root) return null;

    let parent: BSTNode<T> | null = null;
    let crnt: BSTNode<T> | null = this.root;
    let leftChild: Boolean = false;
    while (crnt) {
      const cmp = this.compare(target, crnt.val);
      console.log(cmp);
      if (cmp === 0) break;
      parent = crnt;
      if (cmp < 0) {
        leftChild = true;
        crnt = crnt.left;
      } else {
        leftChild = false;
        crnt = crnt.right;
      }
    }
    if (!crnt) return null;
    if (!crnt.left && !crnt.right) {
      if (crnt === this.root) {
        this.root = null;
      } else if (leftChild) {
        parent!.left = null;
      } else {
        parent!.right = null;
      }
    }
    if (!crnt.left || !crnt.right) {
      const child = crnt.left ?? crnt.right;
      this.root === crnt
        ? (this.root = child)
        : leftChild
          ? (parent!.left = child)
          : (parent!.right = child);
    } else {
      let succParent: BSTNode<T> | null = crnt;
      let succ: BSTNode<T> | null = crnt.right;

      while (succ && succ.left) {
        succParent = succ;
        succ = succ.left;
      }
      crnt.val = succ!.val;
      while (succ) {
        if (!succ.left && !succ.right) {
          if (succParent.left === succ) succParent.left = null;
          else succParent.right = null;
          break;
        } else if (succ.right) {
          if (succParent!.left === succ) succParent!.left = succ.right;
          else succParent!.right = succ.right;
          break;
        }
      }
    }
  }
}
const tree = new BinarySearchTree<number>((a, b) => a - b);
tree.insert(8);
tree.insert(10);
tree.insert(9);
tree.insert(4);
tree.remove(4);
console.dir(tree, { depth: null });
