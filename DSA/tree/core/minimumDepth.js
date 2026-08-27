/**
 * PROBLEM: Minimum Depth of Binary Tree (LeetCode #111)
 *
 * Shortest root-to-LEAF path length. A leaf has no children.
 *
 * INTUITION:
 * The trap: min depth is NOT the mirror of max depth. For a node with one
 * child, `1 + min(left, right)` returns 1 + 0 = 1, but the missing side is not
 * a leaf — it is absent. A single-child node must take the depth of the child
 * that exists.
 *
 * BFS is the better answer anyway: the FIRST leaf encountered is at the minimum
 * depth, so you can return immediately without exploring a deep subtree.
 *
 * TIME: O(n) worst case, often far less with BFS   SPACE: O(w)
 */
const TreeNode = function (val, left = null, right = null) { this.val = val; this.left = left; this.right = right; };

const minDepthBFS = (root) => {
  if (!root) return 0;
  let queue = [root];
  let depth = 1;
  while (queue.length) {
    const next = [];
    for (const node of queue) {
      if (!node.left && !node.right) return depth; // first leaf wins
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
    depth++;
  }
  return depth;
};

const minDepthDFS = (root) => {
  if (!root) return 0;
  if (!root.left) return 1 + minDepthDFS(root.right);  // one-child guard
  if (!root.right) return 1 + minDepthDFS(root.left);
  return 1 + Math.min(minDepthDFS(root.left), minDepthDFS(root.right));
};

const t = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
console.log(minDepthBFS(t), minDepthDFS(t)); // 2 2
const skew = new TreeNode(2, null, new TreeNode(3, null, new TreeNode(4)));
console.log(minDepthBFS(skew), minDepthDFS(skew)); // 3 3 -- not 1
