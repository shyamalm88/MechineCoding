/**
 * PROBLEM: Average of Levels in Binary Tree (LeetCode #637)
 *
 * INTUITION:
 * Any "per level" question is BFS with a LEVEL SNAPSHOT: capture the queue
 * length before processing, then consume exactly that many nodes. Those are
 * precisely the nodes of the current depth, so the average is well defined.
 *
 * Without the snapshot, children enqueued during the loop get mixed into the
 * same level and the averages are wrong — the single most common bug in
 * level-order problems.
 *
 * TIME: O(n)   SPACE: O(w) where w is the widest level
 */
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
