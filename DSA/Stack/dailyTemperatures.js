/**
 * ============================================================================
 * PROBLEM: Daily Temperatures (LeetCode #739)
 * ============================================================================
 * Given an array of integers temperatures represents the daily temperatures,
 * return an array answer such that answer[i] is the number of days you have to
 * wait after the ith day to get a warmer temperature. If there is no future day
 * for which this is possible, keep answer[i] == 0.
 *
 * Example 1:
 * Input: temperatures = [73,74,75,71,69,72,76,73]
 * Output: [1,1,4,2,1,1,0,0]
 *
 * Example 2:
 * Input: temperatures = [30,40,50,60]
 * Output: [1,1,1,0]
 *
 * Constraints:
 * - 1 <= temperatures.length <= 10^5
 * - 30 <= temperatures[i] <= 100
 */

// ============================================================================
// APPROACH: Monotonic Decreasing Stack
// ============================================================================
/**
 * INTUITION:
 * We need to find the *next* greater element for each element.
 * We can use a stack to store indices of temperatures that haven't found a warmer day yet.
 * The stack will be monotonic decreasing (temperatures at indices in stack are decreasing).
 *
 * When we encounter a temperature `T[i]` that is warmer than `T[stack.top()]`,
 * it means `i` is the next warmer day for `stack.top()`. We pop and calculate the difference.
 *
 * Time Complexity: O(N) - Each element is pushed and popped at most once.
 * Space Complexity: O(N) - Stack size.
 */
const dailyTemperatures = (temperatures) => {
  const n = temperatures.length;
  const res = Array(n).fill(0);
  const stack = [];

  for (let i = 0; i < n; i++) {
    // While stack is not empty AND current temperature is warmer than
    // the temperature at the index stored at the top of the stack
    while (
      stack.length &&
      temperatures[i] > temperatures[stack[stack.length - 1]]
    ) {
      // We found a warmer day for the index at stack top
      const prev = stack.pop();
      // Calculate the number of days waited
      res[prev] = i - prev;
    }
    // Push current index to stack to find a warmer day for it later
    stack.push(i);
  }
  return res;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Daily Temperatures Tests ===\n");

console.log("Test 1:", dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])); // Expected: [1, 1, 4, 2, 1, 1, 0, 0]
console.log("Test 2:", dailyTemperatures([30, 40, 50, 60])); // Expected: [1, 1, 1, 0]
console.log("Test 3:", dailyTemperatures([30, 60, 90])); // Expected: [1, 1, 0]

module.exports = { dailyTemperatures };
