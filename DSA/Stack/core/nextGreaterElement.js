/**
 * PROBLEM: Next Greater Element (generic array form)
 *
 * @param {number[]} arr
 * @returns {number[]}
 */
function nextGreaterElement(arr) {
  let n = arr.length;
  let result = new Array(n).fill(-1);
  let stack = []; // Monotonic decreasing stack

  // Traverse from right to left
  for (let i = n - 1; i >= 0; i--) {
    let current = arr[i];

    // 1. Pop elements smaller than current
    while (stack.length > 0 && stack[stack.length - 1] <= current) {
      stack.pop();
    }

    // 2. The top of stack is the next greater element
    if (stack.length > 0) {
      result[i] = stack[stack.length - 1];
    }

    // 3. Push current element to stack for future elements
    stack.push(current);
  }

  return result;
}

// Example:
// Input: [4, 5, 2, 25]
// Output: [5, 25, 25, -1]
