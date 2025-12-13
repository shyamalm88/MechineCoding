/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var zigzagLevelOrder = function (root) {
  if (!root) return []; // Base case: Empty tree

  const results = [];
  const queue = [root];
  let isLeftToRight = true; // 1. Start Direction: Normal

  // 2. Standard BFS Loop
  while (queue.length > 0) {
    const size = queue.length; // Snapshot size
    const level = []; // Holds values for this level

    for (let i = 0; i < size; i++) {
      const node = queue.shift();

      // 3. The Logic (Push vs Unshift)
      if (isLeftToRight) {
        level.push(node.val); // Normal Order
      } else {
        level.unshift(node.val); // Reverse Order
      }

      // 4. Add Children (Always Left then Right)
      // Even if printing right-to-left, we traverse the tree normally!
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    results.push(level);

    // 5. Flip the switch for next level
    isLeftToRight = !isLeftToRight;
  }

  return results;
};
