/**
 * PROBLEM: Continuous Subarray Sum (LeetCode #523)
 *
 * Is there a subarray of length >= 2 whose sum is a multiple of k?
 *
 * INTUITION:
 * Prefix sums plus modular arithmetic. If prefix[j] % k === prefix[i] % k then
 * the sum between them is divisible by k — the remainders cancel.
 *
 * So store the FIRST index at which each remainder was seen. When the remainder
 * repeats, the gap between the indices is the subarray; require a gap of at
 * least 2 to satisfy the length constraint. Storing the first index only is
 * what maximises that gap.
 *
 * Seed the map with {0: -1} so a prefix that is itself divisible by k counts.
 *
 * TIME: O(n)   SPACE: O(min(n,k))
 */
const checkSubarraySum = (nums, k) => {
  const firstIndex = new Map([[0, -1]]);
  let sum = 0;

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    const rem = ((sum % k) + k) % k; // normalise negatives
    if (firstIndex.has(rem)) {
      if (i - firstIndex.get(rem) >= 2) return true;
    } else {
      firstIndex.set(rem, i); // keep the EARLIEST index only
    }
  }
  return false;
};

console.log(checkSubarraySum([23, 2, 4, 6, 7], 6)); // true  [2,4]
console.log(checkSubarraySum([23, 2, 6, 4, 7], 13)); // false
console.log(checkSubarraySum([1, 0], 2)); // false -- sum 1 is not a multiple of 2
