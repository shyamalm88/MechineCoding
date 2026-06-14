/**
 * ============================================================================
 * PROBLEM: Partition to K Equal Sum Subsets (LeetCode #698)
 * ============================================================================
 * Given an integer array nums and an integer k, return true if it is
 * possible to divide this array into k non-empty subsets whose sums are
 * all equal.
 *
 * Example 1:
 * Input: nums = [4,3,2,3,5,2,1], k = 4
 * Output: true
 * Explanation: It's possible to divide it into 4 subsets with equal sums:
 * (5), (1,4), (2,3), (2,3)
 *
 * Example 2:
 * Input: nums = [1,2,3,4], k = 3
 * Output: false
 *
 * Constraints:
 * - 1 <= k <= nums.length <= 16
 * - 1 <= nums[i] <= 10^4
 * - The frequency of each element is in the range [1, 4].
 */

// ============================================================================
// APPROACH: Backtracking — fill K buckets to a shared target sum
// ============================================================================
/**
 * STORY / INTUITION:
 * Think of K empty BUCKETS, each needing to be filled to exactly
 * `target = sum(nums) / k`. Go through the numbers ONE AT A TIME (largest
 * first) and try dropping each one into each bucket. If a number doesn't
 * fit (would overflow a bucket past `target`), skip that bucket. If every
 * number gets placed and every bucket lands exactly on `target`, success.
 *
 * Two pruning rules make this fast enough:
 *
 * 1. SORT DESCENDING first. Large numbers have the FEWEST valid buckets
 *    they can go into, so deciding their placement EARLY prunes the search
 *    tree the most (fail fast instead of late).
 *
 * 2. EMPTY-BUCKET SYMMETRY: if placing a number into an EMPTY bucket leads
 *    to failure down the line, trying it in any OTHER empty bucket would
 *    fail identically (empty buckets are interchangeable) — so the moment
 *    we backtrack out of an empty bucket, BREAK instead of trying the next
 *    bucket.
 *
 * DRY RUN: nums = [4,3,2,3,5,2,1], k = 4
 * sum = 20, target = 5. sorted desc = [5,4,3,3,2,2,1]
 *
 * Place 5 → bucket0 = 5 (full)                    buckets=[5,0,0,0]
 * Place 4 → bucket1 = 4                           buckets=[5,4,0,0]
 * Place 3 → bucket0(8>5) bucket1(7>5) → bucket2=3 buckets=[5,4,3,0]
 * Place 3 → ...bucket3=3                          buckets=[5,4,3,3]
 * Place 2 → bucket0,1 overflow → bucket2=3+2=5    buckets=[5,4,5,3]
 * Place 2 → bucket0,1,2 overflow → bucket3=3+2=5  buckets=[5,4,5,5]
 * Place 1 → bucket0,2,3 full → bucket1=4+1=5      buckets=[5,5,5,5]
 *
 * All 7 numbers placed, all buckets == target → true ✓
 *
 * Time:  O(K^N) worst case, heavily pruned by sorting + empty-bucket skip
 * Space: O(N) recursion depth + O(K) buckets
 */
const canPartitionKSubsets = (nums, k) => {
  const totalSum = nums.reduce((a, b) => a + b, 0);
  if (totalSum % k !== 0) return false;

  const target = totalSum / k;
  const sorted = [...nums].sort((a, b) => b - a); // descending
  if (sorted[0] > target) return false;

  const buckets = new Array(k).fill(0);

  const backtrack = (index) => {
    if (index === sorted.length) return true; // every number placed successfully

    for (let i = 0; i < k; i++) {
      if (buckets[i] + sorted[index] > target) continue;

      buckets[i] += sorted[index];
      if (backtrack(index + 1)) return true;
      buckets[i] -= sorted[index];

      // Empty-bucket symmetry: if it failed here, it'll fail in every
      // other empty bucket too — no point trying them.
      if (buckets[i] === 0) break;
    }

    return false;
  };

  return backtrack(0);
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Partition to K Equal Sum Subsets Tests ===\n");

console.log("Test 1:", canPartitionKSubsets([4, 3, 2, 3, 5, 2, 1], 4)); // Expected: true
console.log("Test 2:", canPartitionKSubsets([1, 2, 3, 4], 3));          // Expected: false
console.log("Test 3:", canPartitionKSubsets([2, 2, 2, 2, 3, 4, 5], 4)); // Expected: false
console.log("Test 4:", canPartitionKSubsets([1, 1, 1, 1, 2, 2, 2, 2], 4)); // Expected: true

module.exports = { canPartitionKSubsets };
