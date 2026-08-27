/**
 * PROBLEM: Next Greater Element I (LeetCode #496)
 *
 * nums1 is a subset of nums2. For each value in nums1, find the first greater
 * element to its RIGHT in nums2, or -1.
 *
 * INTUITION:
 * Solve it once for nums2 with a monotonic decreasing stack, storing every
 * answer in a Map keyed by VALUE (the problem guarantees distinct values, which
 * is what makes value-keying safe). Then nums1 is a lookup.
 *
 * Scanning left to right: while the stack top is smaller than the current
 * element, the current element IS its next greater — pop and record.
 *
 * DRY RUN: nums2 = [1,3,4,2]
 *   1 → push [1]
 *   3 → pops 1 → map{1:3}; push [3]
 *   4 → pops 3 → map{3:4}; push [4]
 *   2 → push [4,2]; leftovers get -1 → map{4:-1, 2:-1}
 *   nums1 [4,1,2] → [-1, 3, -1]
 *
 * TIME: O(n + m)   SPACE: O(n)
 */
const nextGreaterElement = (nums1, nums2) => {
  const nextGreater = new Map();
  const stack = []; // decreasing

  for (const num of nums2) {
    while (stack.length && stack[stack.length - 1] < num) {
      nextGreater.set(stack.pop(), num);
    }
    stack.push(num);
  }
  // anything still stacked has nothing greater to its right
  for (const leftover of stack) nextGreater.set(leftover, -1);

  return nums1.map((n) => nextGreater.get(n) ?? -1);
};

console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2])); // [-1,3,-1]
console.log(nextGreaterElement([2, 4], [1, 2, 3, 4])); // [3,-1]
