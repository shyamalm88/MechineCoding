/**
 * ============================================================================
 * PROBLEM: House Robber III (LeetCode #337)
 * CATEGORY: 🔴 VVIMP (Tree DP / Return-Multiple-States DP)
 * ============================================================================
 *
 * You are given the root of a binary tree.
 *
 * Each node represents a house with some amount of money.
 *
 * Constraint:
 * - If you rob a house, you CANNOT rob its direct children.
 *
 * Goal:
 * - Return the MAXIMUM amount of money you can rob.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *         3
 *        / \
 *       2   3
 *        \   \
 *         3   1
 *
 * Output: 7
 * Explanation:
 *   Rob 3 (root), 3 (left.right), and 1 (right.right)
 *
 * ---------------------------------------------------------------------------
 * Constraints:
 * - Number of nodes <= 10^4
 *
 * ============================================================================
 * INTUITION: Why Linear DP Fails Here
 * ============================================================================
 *
 * House Robber I / II:
 * - Houses are in a LINE / CIRCLE
 *
 * Here:
 * - Houses form a TREE
 *
 * Key Insight (CRITICAL):
 *
 *   The decision at a node affects BOTH subtrees independently.
 *
 * We cannot flatten the tree safely.
 *
 * ============================================================================
 * CORE DP IDEA (THIS IS THE KEY)
 * ============================================================================
 *
 * For each node, we must answer TWO questions:
 *
 *   1️⃣ What is the max money if I ROB this node?
 *   2️⃣ What is the max money if I DO NOT rob this node?
 *
 * These two values completely describe the future.
 *
 * ============================================================================
 * DP STATE DEFINITION
 * ============================================================================
 *
 * For each node, return:
 *
 *   [rob, skip]
 *
 * Where:
 * - rob  = max money if we ROB this node
 * - skip = max money if we DO NOT rob this node
 *
 * ============================================================================
 * DP TRANSITION (VERY IMPORTANT)
 * ============================================================================
 *
 * If we ROB current node:
 *   - We CANNOT rob children
 *
 *   rob =
 *     node.val
 *     + left.skip
 *     + right.skip
 *
 * If we SKIP current node:
 *   - We are FREE to rob or skip children
 *
 *   skip =
 *     max(left.rob, left.skip)
 *     + max(right.rob, right.skip)
 *
 * ============================================================================
 * BASE CASE
 * ============================================================================
 *
 * If node is null:
 *   return [0, 0]
 *
 * ============================================================================
 * ORDER OF COMPUTATION
 * ============================================================================
 *
 * This MUST be post-order DFS:
 * - children first
 * - parent last
 *
 * Because:
 * - Parent depends on children states
 *
 * ============================================================================
 * ALGORITHM
 * ============================================================================
 *
 * 1. DFS(node):
 *      - get [lRob, lSkip] from left
 *      - get [rRob, rSkip] from right
 *      - compute rob and skip
 *      - return [rob, skip]
 *
 * 2. Final answer:
 *      max(root.rob, root.skip)
 *
 * ============================================================================
 * TIME & SPACE COMPLEXITY
 * ============================================================================
 *
 * Time:  O(n)
 * Space: O(h)  (recursion stack, h = tree height)
 *
 * ============================================================================
 * WHY THIS PROBLEM IS 🔴 VVIMP
 * ============================================================================
 *
 * Interviewers are testing:
 * - Can you do DP without arrays?
 * - Can you return multiple states?
 * - Do you understand tree dependency?
 *
 * This problem is a GATEWAY to advanced DP.
 * ============================================================================
 */

function rob(root) {
  function dfs(node) {
    if (!node) return [0, 0];

    const [lRob, lSkip] = dfs(node.left);
    const [rRob, rSkip] = dfs(node.right);

    const robThis = node.val + lSkip + rSkip;

    const skipThis = Math.max(lRob, lSkip) + Math.max(rRob, rSkip);

    return [robThis, skipThis];
  }

  const [robRoot, skipRoot] = dfs(root);
  return Math.max(robRoot, skipRoot);
}
