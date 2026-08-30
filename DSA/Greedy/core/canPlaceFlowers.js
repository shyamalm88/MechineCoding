/**
 * ============================================================================
 * PROBLEM: Can Place Flowers (LeetCode #605)
 * ============================================================================
 * You have a long flowerbed where some plots are planted (1) and some are not
 * (0). Flowers cannot be planted in ADJACENT plots. Given the flowerbed and an
 * integer n, return true if n new flowers can be planted without violating the
 * no-adjacent-flowers rule.
 *
 * Example 1:
 * Input: flowerbed = [1,0,0,0,1], n = 1 → Output: true
 *
 * Example 2:
 * Input: flowerbed = [1,0,0,0,1], n = 2 → Output: false
 *
 * Constraints:
 * - 1 <= flowerbed.length <= 2 * 10^4
 * - flowerbed[i] is 0 or 1
 * - There are no two adjacent flowers in the input
 * - 0 <= n <= flowerbed.length
 */

// ============================================================================
// APPROACH: Greedy Left-to-Right — Plant at the First Legal Plot
// ============================================================================
/**
 * STORY / INTUITION:
 * Sweep left to right and plant the moment it is legal: the plot is empty AND
 * both neighbours are empty (treating off-the-end as empty, since there is no
 * flower out there to conflict with).
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * Consider any maximal run of zeros. Planting as early as possible inside it
 * is optimal because a flower placed at position i blocks exactly i-1 and i+1
 * — the same amount of damage wherever you put it — but planting EARLY leaves
 * the longest possible unblocked tail to the right. Delaying a plant never
 * unlocks a slot; it can only waste one. Formally, a run of k zeros bounded by
 * flowers fits floor((k-1)/2) plants and the left-greedy sweep always achieves
 * that bound.
 *
 * WATCH THE EDGES: the first and last plots have only one neighbour. Guarding
 * with `i === 0 ||` and `i === len-1 ||` is what makes [0,0,1] correctly yield
 * one plant instead of zero.
 *
 * DRY RUN: [1,0,0,0,1], n = 2
 * i=0: plot is 1 → skip
 * i=1: 0 but left neighbour is 1 → skip
 * i=2: 0, left 0, right 0 → PLANT. bed = [1,0,1,0,1], count = 1
 * i=3: 0 but left is now 1 → skip
 * i=4: plot is 1 → skip
 * count 1 < 2 → FALSE
 *
 * Time:  O(N) — single pass
 * Space: O(1) — mutates in place
 */
const canPlaceFlowers = (flowerbed, n) => {
  let count = 0;

  for (let i = 0; i < flowerbed.length; i++) {
    // Off-the-end counts as empty: there is no flower beyond the bed.
    const leftFree = i === 0 || flowerbed[i - 1] === 0;
    const rightFree = i === flowerbed.length - 1 || flowerbed[i + 1] === 0;

    if (flowerbed[i] === 0 && leftFree && rightFree) {
      flowerbed[i] = 1; // commit, so the next index sees this flower
      count++;
      if (count >= n) return true; // early exit
    }
  }

  return count >= n;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Can Place Flowers Tests ===\n");

console.log("Test 1:", canPlaceFlowers([1, 0, 0, 0, 1], 1)); // Expected: true
console.log("Test 2:", canPlaceFlowers([1, 0, 0, 0, 1], 2)); // Expected: false
console.log("Test 3:", canPlaceFlowers([0, 0, 1], 1));       // Expected: true (edge plot)
console.log("Test 4:", canPlaceFlowers([1, 0, 1, 0, 1], 0)); // Expected: true (n = 0)
console.log("Test 5:", canPlaceFlowers([0, 0, 0, 0, 0], 3)); // Expected: true (plant at 0,2,4)

module.exports = { canPlaceFlowers };
