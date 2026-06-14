/**
 * ============================================================================
 * PROBLEM: House Robber III (LeetCode #337)
 * ============================================================================
 * The thief has found a new place for his thievery. The houses form a
 * binary tree — the root is the only entrance. If two directly-linked
 * houses (a node and its child) are both robbed on the same night, an
 * alarm goes off.
 *
 * Given the root of the binary tree, return the maximum amount of money
 * the thief can rob WITHOUT alerting the police.
 *
 * Example 1:
 *       3
 *      / \
 *     2   3
 *      \   \
 *       3   1
 *
 * Input: root = [3,2,3,null,3,null,1]
 * Output: 7
 * Explanation: Rob 3 + 3 + 1 = 7 (the root's grandchildren).
 *
 * Example 2:
 *         3
 *        / \
 *       4   5
 *      / \   \
 *     1   3   1
 *
 * Input: root = [3,4,5,1,3,null,1]
 * Output: 9
 * Explanation: Rob 4 + 5 = 9 (neither is the other's parent/child).
 *
 * Constraints:
 * - The number of nodes is in the range [1, 10^4].
 * - 0 <= Node.val <= 10^4
 */

// ============================================================================
// APPROACH: Post-Order DFS returning a [rob, skip] pair per node
// ============================================================================
/**
 * STORY / INTUITION:
 * For every node, the thief faces a binary choice: ROB it or SKIP it.
 * But that choice has a ripple effect — if you rob THIS node, you are
 * FORBIDDEN from robbing its direct children (they must be "skipped").
 *
 * So instead of returning a single number from each subtree, return TWO:
 *   - robbed:  max money if we ROB this node
 *              = node.val + (children's "skipped" totals — forced)
 *   - skipped: max money if we DON'T rob this node
 *              = for EACH child, take whichever is bigger
 *                (rob that child OR skip it — our choice, no constraint)
 *
 * The final answer is max(root.robbed, root.skipped) — the thief picks
 * whichever is better at the very top.
 *
 * DRY RUN: root = [3,2,3,null,3,null,1]
 *       3
 *      / \
 *     2   3
 *      \   \
 *       3   1
 *
 * Leaf "3" (left child of 2):   [robbed=3, skipped=0]
 * Leaf "1" (right child of 3):  [robbed=1, skipped=0]
 *
 * Node "2" (right child = leaf "3" [3,0], left = null [0,0]):
 *   robbed  = 2 + 0(left.skipped) + 0(right.skipped) = 2
 *   skipped = max(0,0) + max(3,0) = 0 + 3 = 3
 *   → [2, 3]
 *
 * Node "3" (right child = leaf "1" [1,0], left = null [0,0]):
 *   robbed  = 3 + 0 + 0 = 3
 *   skipped = max(0,0) + max(1,0) = 0 + 1 = 1
 *   → [3, 1]
 *
 * Root "3" (left=[2,3], right=[3,1]):
 *   robbed  = 3 + left.skipped(3) + right.skipped(1) = 7
 *   skipped = max(2,3) + max(3,1) = 3 + 3 = 6
 *   → max(7, 6) = 7 ✓
 *
 * Time:  O(N) — each node visited once
 * Space: O(H) — recursion stack, H = tree height
 */
const rob = (root) => {
  // Returns [moneyIfRobbedThisNode, moneyIfSkippedThisNode]
  const dfs = (node) => {
    if (!node) return [0, 0];

    const [leftRob, leftSkip] = dfs(node.left);
    const [rightRob, rightSkip] = dfs(node.right);

    // Rob this node → children MUST be skipped
    const robbed = node.val + leftSkip + rightSkip;
    // Skip this node → each child independently picks its best option
    const skipped = Math.max(leftRob, leftSkip) + Math.max(rightRob, rightSkip);

    return [robbed, skipped];
  };

  const [robbedRoot, skippedRoot] = dfs(root);
  return Math.max(robbedRoot, skippedRoot);
};

// Simple TreeNode definition for testing
function TreeNode(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== House Robber III Tests ===\n");

// Test 1: [3,2,3,null,3,null,1] → 7
const tree1 = new TreeNode(
  3,
  new TreeNode(2, null, new TreeNode(3)),
  new TreeNode(3, null, new TreeNode(1))
);
console.log("Test 1:", rob(tree1)); // Expected: 7

// Test 2: [3,4,5,1,3,null,1] → 9
const tree2 = new TreeNode(
  3,
  new TreeNode(4, new TreeNode(1), new TreeNode(3)),
  new TreeNode(5, null, new TreeNode(1))
);
console.log("Test 2:", rob(tree2)); // Expected: 9

// Test 3: Single node
console.log("Test 3:", rob(new TreeNode(5))); // Expected: 5

module.exports = { rob };
