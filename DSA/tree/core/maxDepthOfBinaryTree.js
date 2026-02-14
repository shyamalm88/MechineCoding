/**
 * ============================================================================
 * PROBLEM: Maximum Depth of Binary Tree (LeetCode #104)
 * CATEGORY: 🔵 CORE (Tree Recursion / Height Computation)
 * ============================================================================
 *
 * Given the root of a binary tree,
 * return its maximum depth.
 *
 * The maximum depth is the number of nodes
 * along the longest path from the root down to a leaf.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *         3
 *        / \
 *       9  20
 *          / \
 *         15  7
 *
 * Output: 3
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 *
 * A tree’s depth is defined RECURSIVELY.
 *
 * Key insight:
 * - The depth of a tree is:
 *     1 + max(depth of left subtree,
 *             depth of right subtree)
 *
 * This is the MOST BASIC tree invariant.
 *
 * ============================================================================
 * SUBTREE QUESTION (CRITICAL)
 * ============================================================================
 *
 * Ask each subtree:
 *   “What is your depth?”
 *
 * The parent just:
 *   - takes the max
 *   - adds 1 for itself
 *
 * ============================================================================
 * BASE CASE
 * ============================================================================
 *
 * If node is null:
 *   depth = 0
 *
 * ============================================================================
 * TRAVERSAL TYPE
 * ============================================================================
 *
 * POSTORDER
 * - children first
 * - parent uses children’s results
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Time:  O(n)   (visit every node once)
 * Space: O(h)   (recursion stack, h = tree height)
 *
 * ============================================================================
 * WHY THIS IS 🔵 CORE
 * ============================================================================
 *
 * This problem tests:
 * - recursion clarity
 * - base case correctness
 * - return-value discipline
 *
 * If this is shaky, all tree problems become shaky.
 * ============================================================================
 */

function maxDepth(root) {
  if (root === null) return 0;

  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);

  return 1 + Math.max(leftDepth, rightDepth);
}
