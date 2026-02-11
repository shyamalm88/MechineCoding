/**
 * ============================================================================
 * PROBLEM: Largest Rectangle in Histogram (LeetCode #84)
 * ============================================================================
 * Given an array of integers heights representing the histogram's bar height
 * where the width of each bar is 1, return the area of the largest rectangle
 * in the histogram.
 *
 * Example 1:
 * Input: heights = [2,1,5,6,2,3]
 * Output: 10
 * Explanation: The largest rectangle has an area = 10 units.
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
// APPROACH: Monotonic Increasing Stack
// ============================================================================
/**
 * INTUITION:
 * For any specific bar 'h', the largest rectangle using 'h' as the full height
 * extends to the left until it hits a bar smaller than 'h', and to the right
 * until it hits a bar smaller than 'h'.
 *
 * We need to find:
 * 1. Previous Less Element (PLE) index -> Left Boundary
 * 2. Next Less Element (NLE) index -> Right Boundary
 * Area = height[i] * (RightBoundary - LeftBoundary - 1)
 *
 * We can use a Monotonic Increasing Stack to find these boundaries efficiently.
 * - The stack stores indices.
 * - Elements in the stack always correspond to increasing heights.
 * - When we encounter a current height < height[top_of_stack], it means
 *   we found the "Next Less Element" (Right Boundary) for the bar at top_of_stack.
 * - We pop the stack. The popped element is the bar we calculate area for.
 * - The new top of stack is the "Previous Less Element" (Left Boundary).
 *
 * DRY RUN:
 * Input: [2, 1, 5, 6, 2, 3]
 * Add sentinel 0 at end -> [2, 1, 5, 6, 2, 3, 0]
 * Stack: []
 *
 * 1. i=0, h=2. Stack empty. Push 0. Stack: [0] (vals: [2])
 *
 * 2. i=1, h=1. 1 < 2. Pop 0.
 *    - Height = 2
 *    - Right Boundary (i) = 1
 *    - Left Boundary (new stack top) = -1 (empty stack implies start)
 *    - Width = 1 - (-1) - 1 = 1. Area = 2*1 = 2. MaxArea = 2.
 *    - Push 1. Stack: [1] (vals: [1])
 *
 * 3. i=2, h=5. 5 >= 1. Push 2. Stack: [1, 2] (vals: [1, 5])
 *
 * 4. i=3, h=6. 6 >= 5. Push 3. Stack: [1, 2, 3] (vals: [1, 5, 6])
 *
 * 5. i=4, h=2. 2 < 6. Pop 3.
 *    - Height = 6
 *    - Right Boundary (i) = 4
 *    - Left Boundary (stack top) = 2
 *    - Width = 4 - 2 - 1 = 1. Area = 6*1 = 6. MaxArea = 6.
 *    - Stack: [1, 2] (vals: [1, 5])
 *
 *    2 < 5. Pop 2.
 *    - Height = 5
 *    - Right Boundary (i) = 4
 *    - Left Boundary (stack top) = 1
 *    - Width = 4 - 1 - 1 = 2. Area = 5*2 = 10. MaxArea = 10.
 *    - Stack: [1] (vals: [1])
 *
 *    2 >= 1. Push 4. Stack: [1, 4] (vals: [1, 2])
 *
 * 6. i=5, h=3. 3 >= 2. Push 5. Stack: [1, 4, 5] (vals: [1, 2, 3])
 *
 * 7. i=6, h=0 (Sentinel). 0 < 3. Pop 5.
 *    - Height = 3
 *    - Right Boundary = 6
 *    - Left Boundary = 4
 *    - Width = 6 - 4 - 1 = 1. Area = 3.
 *    - Stack: [1, 4]
 *
 *    ... (pops remaining elements) ...
 *
 * Final MaxArea = 10.
 *
 * Time Complexity: O(N) - Each element pushed and popped once.
 * Space Complexity: O(N) - Stack size.
 */
function largestRectangleHistogram(heights) {
  const stack = [];
  let maxArea = 0;

  // Add a sentinel 0 at the end to ensure all bars are processed
  // This forces the stack to empty out at the end
  heights.push(0);

  for (let i = 0; i < heights.length; i++) {
    // While current bar is shorter than the bar at stack top,
    // we have found the Right Boundary for the bar at stack top.
    const stackTop = stack.length - 1;
    while (stack.length && heights[i] < heights[stack[stackTop]]) {
      const h = heights[stack.pop()];

      // The Left Boundary is the previous element in stack
      // If stack is empty, it means h was the smallest so far, extending to index 0
      // Width = RightBoundary - LeftBoundary - 1
      const w = stack.length ? i - stack[stackTop] - 1 : i;

      maxArea = Math.max(maxArea, h * w);
    }
    stack.push(i);
  }

  // Restore the array (remove sentinel)
  heights.pop();
  return maxArea;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Largest Rectangle in Histogram Tests ===\n");

// Test 1: Standard case
const t1 = [2, 1, 5, 6, 2, 3];
console.log("Test 1:", largestRectangleHistogram([...t1]));
// Expected: 10

// Test 2: Ascending order
const t2 = [1, 2, 3, 4, 5];
console.log("Test 2:", largestRectangleHistogram([...t2]));
// Expected: 9 (height 3 * width 3)

// Test 3: Descending order
const t3 = [5, 4, 3, 2, 1];
console.log("Test 3:", largestRectangleHistogram([...t3]));
// Expected: 9 (height 3 * width 3)

// Test 4: All same
const t4 = [2, 2, 2, 2];
console.log("Test 4:", largestRectangleHistogram([...t4]));
// Expected: 8

// Test 5: Single element
const t5 = [5];
console.log("Test 5:", largestRectangleHistogram([...t5]));
// Expected: 5

module.exports = { largestRectangleHistogram };
