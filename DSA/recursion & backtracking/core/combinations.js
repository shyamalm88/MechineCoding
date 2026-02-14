/**
 * ============================================================================
 * PROBLEM: Combinations (LeetCode #77)
 * CATEGORY: 🔵 CORE (Backtracking Fundamentals)
 * ============================================================================
 *
 * Given two integers n and k,
 * return all possible combinations of k numbers
 * chosen from the range [1, n].
 *
 * Order does NOT matter.
 *
 * ---------------------------------------------------------------------------
 * Example:
 *
 *   n = 4, k = 2
 *
 *   Output:
 *   [
 *     [1,2],
 *     [1,3],
 *     [1,4],
 *     [2,3],
 *     [2,4],
 *     [3,4]
 *   ]
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 *
 * This is the PUREST backtracking problem.
 *
 * At each step:
 * - Decide whether to INCLUDE a number
 * - Move forward so we never reuse numbers
 *
 * Key Insight:
 * - Order doesn't matter → we must avoid revisiting smaller numbers
 *
 * ============================================================================
 * BACKTRACKING STATE
 * ============================================================================
 *
 * State:
 * - path   → current combination
 * - start  → next number we are allowed to use
 *
 * Goal:
 * - path.length === k
 *
 * ============================================================================
 * DECISION TREE
 * ============================================================================
 *
 * For each number i from start → n:
 *   - choose i
 *   - recurse with start = i + 1
 *   - undo (backtrack)
 *
 * ============================================================================
 * TIME COMPLEXITY
 * ============================================================================
 *
 * O(C(n, k))
 *
 * ============================================================================
 * WHY THIS IS 🔵 CORE
 * ============================================================================
 *
 * This defines the TEMPLATE for:
 * - subsets
 * - permutations
 * - combinationSum
 *
 * If this is shaky, everything else breaks.
 * ============================================================================
 */

function combine(n, k) {
  const result = [];

  function backtrack(start, path) {
    // base case
    if (path.length === k) {
      result.push([...path]);
      return;
    }

    for (let i = start; i <= n; i++) {
      path.push(i);
      backtrack(i + 1, path);
      path.pop(); // undo
    }
  }

  backtrack(1, []);
  return result;
}
