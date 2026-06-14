/**
 * ============================================================================
 * PROBLEM: Largest Rectangle in Histogram (LeetCode #84)
 * ============================================================================
 * Given an array of integers `heights` representing the histogram's bar
 * heights, where each bar has width 1, return the area of the largest
 * rectangle that can be formed within the histogram.
 *
 * Example 1:
 *
 *           ___
 *      ___ |   |
 *     |   ||   |___
 *  ___|   ||   |   |___
 * |   |   ||   |   |   |
 * | 2 | 1 | 5 | 6 | 2 | 3 |
 *
 * Input: heights = [2,1,5,6,2,3]
 * Output: 10
 * Explanation: The shaded rectangle (bars at index 2-3, height 5) has area
 *              5 * 2 = 10.
 *
 * Example 2:
 * Input: heights = [2,4]
 * Output: 4
 *
 * Constraints:
 * - 1 <= heights.length <= 10^5
 * - 0 <= heights[i] <= 10^4
 */

// ============================================================================
// APPROACH: Monotonic Increasing Stack of indices
// ============================================================================
/**
 * STORY / INTUITION:
 * For every bar, the largest rectangle that uses THAT bar as its shortest
 * (limiting) bar extends left and right until it hits a shorter bar on
 * either side. So for each bar i, we need: "how far left/right can I go
 * before hitting something shorter than heights[i]?"
 *
 * A monotonic increasing stack (of indices) tracks bars that are still
 * "active" — each one is currently the shortest bar seen since the last
 * one that was shorter. When we see a bar SHORTER than the stack's top,
 * the top bar can't extend any further right — its rectangle is finalized:
 *   - height = heights[popped index]
 *   - width  = current index - (new stack top index) - 1
 *              (or just current index if the stack is now empty,
 *               meaning this bar was the shortest seen so far)
 *
 * We append a sentinel height of 0 at the end (i === heights.length) to
 * force every remaining bar in the stack to be flushed and measured.
 *
 * DRY RUN: heights = [2,1,5,6,2,3]  (process i = 0..6, h(6) = 0 sentinel)
 *
 * i=0 h=2: stack=[]        → push 0           → stack=[0]
 * i=1 h=1: heights[0]=2>=1 → pop 0 (h=2)
 *          width = i = 1   → area = 2*1 = 2   → max=2
 *          stack=[]        → push 1           → stack=[1]
 * i=2 h=5: heights[1]=1<5  → push 2           → stack=[1,2]
 * i=3 h=6: heights[2]=5<6  → push 3           → stack=[1,2,3]
 * i=4 h=2: heights[3]=6>=2 → pop 3 (h=6)
 *          width = 4-2-1=1 → area = 6*1 = 6   → max=6
 *          heights[2]=5>=2 → pop 2 (h=5)
 *          width = 4-1-1=2 → area = 5*2 = 10  → max=10
 *          heights[1]=1<2  → push 4           → stack=[1,4]
 * i=5 h=3: heights[4]=2<3  → push 5           → stack=[1,4,5]
 * i=6 h=0 (sentinel): flush everything
 *          pop 5 (h=3), width=6-4-1=1, area=3  → max stays 10
 *          pop 4 (h=2), width=6-1-1=4, area=8  → max stays 10
 *          pop 1 (h=1), width=6 (stack empty), area=6 → max stays 10
 *
 * Result: 10 ✓
 *
 * Time:  O(N) — each index is pushed and popped at most once
 * Space: O(N) — stack of indices
 */
const largestRectangleArea = (heights) => {
  const stack = []; // indices of bars, heights strictly increasing bottom→top
  let maxArea = 0;

  for (let i = 0; i <= heights.length; i++) {
    // Sentinel height of 0 at i === heights.length flushes the stack
    const h = i === heights.length ? 0 : heights[i];

    while (stack.length > 0 && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const width =
        stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    stack.push(i);
  }

  return maxArea;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Largest Rectangle in Histogram Tests ===\n");

console.log("Test 1:", largestRectangleArea([2, 1, 5, 6, 2, 3])); // Expected: 10
console.log("Test 2:", largestRectangleArea([2, 4]));             // Expected: 4
console.log("Test 3:", largestRectangleArea([1, 1, 1, 1]));       // Expected: 4
console.log("Test 4:", largestRectangleArea([0]));                // Expected: 0
console.log("Test 5:", largestRectangleArea([6, 2, 5, 4, 5, 1, 6])); // Expected: 12

module.exports = { largestRectangleArea };
