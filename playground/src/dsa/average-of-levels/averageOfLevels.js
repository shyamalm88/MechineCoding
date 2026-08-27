const TreeNode = function (val, left = null, right = null) { this.val = val; this.left = left; this.right = right; };

const averageOfLevels = (root) => {
  if (!root) return [];
  const out = [];
  let queue = [root];

  while (queue.length) {
    const levelSize = queue.length; // snapshot BEFORE enqueuing children
    let sum = 0;
    const next = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue[i];
      sum += node.val;
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    out.push(sum / levelSize);
    queue = next;
  }
  return out;
};

const t = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log(averageOfLevels(t)); // [3, 14.5, 11]
