/**
 * PROBLEM: Sum of Subarray Minimums (LeetCode #907)
 *
 * Sum min(b) over every contiguous subarray b. Answer modulo 1e9+7.
 *
 * INTUITION:
 * Enumerating all O(n^2) subarrays is too slow. Flip the question: instead of
 * "what is the min of this subarray?", ask
 *
 *     for each element, HOW MANY subarrays is it the minimum of?
 *
 * That count is (distance to the previous smaller element) ×
 * (distance to the next smaller element) — the number of ways to choose a left
 * and right boundary within which arr[i] is smallest. This is the
 * CONTRIBUTION technique, and a monotonic stack finds both boundaries in O(n).
 *
 * The tie-break matters: use STRICTLY smaller on one side and smaller-or-equal
 * on the other, or subarrays with duplicate minima get counted twice.
 *
 * DRY RUN: [3,1,2,4]
 *   element 1 at index 1: prev smaller none (left=2 choices), next smaller none
 *   (right=3) → contributes 1 × 2 × 3 = 6
 *   ... total 17
 *
 * TIME: O(n)   SPACE: O(n)
 */
const sumSubarrayMins = (arr) => {
  const MOD = 1_000_000_007n;
  const n = arr.length;
  const left = new Array(n);  // # of subarrays extending left where arr[i] is min
  const right = new Array(n);
  const stack = [];

  // previous STRICTLY smaller
  for (let i = 0; i < n; i++) {
    while (stack.length && arr[stack[stack.length - 1]] >= arr[i]) stack.pop();
    left[i] = stack.length ? i - stack[stack.length - 1] : i + 1;
    stack.push(i);
  }

  stack.length = 0;
  // next smaller OR EQUAL -- the asymmetry prevents double counting duplicates
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && arr[stack[stack.length - 1]] > arr[i]) stack.pop();
    right[i] = stack.length ? stack[stack.length - 1] - i : n - i;
    stack.push(i);
  }

  let total = 0n;
  for (let i = 0; i < n; i++) {
    total = (total + BigInt(arr[i]) * BigInt(left[i]) * BigInt(right[i])) % MOD;
  }
  return Number(total);
};

console.log(sumSubarrayMins([3, 1, 2, 4]));            // 17
console.log(sumSubarrayMins([11, 81, 94, 43, 3]));     // 444
console.log(sumSubarrayMins([2, 2, 2]));               // 12 -- duplicates handled
