/**
 * ============================================================================
 * PROBLEM: Koko Eating Bananas (LeetCode #875)
 * ============================================================================
 * Koko has piles of bananas and h hours before guards return. She picks a
 * speed k (bananas/hour). Each hour she eats min(pile, k) from one pile.
 * Find the MINIMUM k such that she can eat all bananas within h hours.
 *
 * Example 1:
 * Input: piles=[3,6,7,11], h=8 → Output: 4
 *
 * Example 2:
 * Input: piles=[30,11,23,4,20], h=5 → Output: 30
 *
 * Example 3:
 * Input: piles=[30,11,23,4,20], h=6 → Output: 23
 *
 * Constraints:
 * - 1 <= piles.length <= 10^4
 * - piles.length <= h <= 10^9
 * - 1 <= piles[i] <= 10^9
 */

// ============================================================================
// APPROACH: Binary Search on the ANSWER (speed k)
// ============================================================================
/**
 * STORY / INTUITION:
 * This is the classic "binary search on answer" pattern.
 * Instead of searching an array, we search the ANSWER SPACE: speed k ∈ [1, max(piles)].
 *
 * Key insight: If Koko CAN finish at speed k, she can also finish at any speed > k.
 * This monotonic property means we can binary search:
 *   → if canFinish(mid), try slower (go left: hi=mid)
 *   → if can't finish, go faster (go right: lo=mid+1)
 *
 * canFinish(speed, h): sum of ceil(pile/speed) for all piles <= h?
 *
 * Search space: lo=1 (slowest possible), hi=max(piles) (eat biggest pile in 1hr)
 *
 * DRY RUN: piles=[3,6,7,11], h=8
 * lo=1, hi=11 → mid=6: hours=ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)=1+1+2+2=6 ≤ 8 ✓ → hi=6
 * lo=1, hi=6  → mid=3: hours=1+2+3+4=10 > 8 ✗ → lo=4
 * lo=4, hi=6  → mid=5: hours=1+2+2+3=8 ≤ 8 ✓ → hi=5
 * lo=4, hi=5  → mid=4: hours=1+2+2+3=8 ≤ 8 ✓ → hi=4
 * lo=4, hi=4  → done. Answer: 4 ✓
 *
 * Time:  O(N log M) where N=piles.length, M=max(piles)
 * Space: O(1)
 */
const minEatingSpeed = (piles, h) => {
  const canFinish = (speed) => {
    let hours = 0;
    for (const pile of piles) {
      hours += Math.ceil(pile / speed);
    }
    return hours <= h;
  };

  let lo = 1;
  let hi = Math.max(...piles);

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canFinish(mid)) {
      hi = mid; // mid works, try slower
    } else {
      lo = mid + 1; // too slow, need faster
    }
  }

  return lo;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Koko Eating Bananas Tests ===\n");

console.log("Test 1:", minEatingSpeed([3, 6, 7, 11], 8));       // Expected: 4
console.log("Test 2:", minEatingSpeed([30, 11, 23, 4, 20], 5)); // Expected: 30
console.log("Test 3:", minEatingSpeed([30, 11, 23, 4, 20], 6)); // Expected: 23
console.log("Test 4:", minEatingSpeed([1, 1, 1, 1], 4));        // Expected: 1

module.exports = { minEatingSpeed };
