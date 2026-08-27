// ============================================================================
// APPROACH: Binary Search on the ANSWER (capacity)
// ============================================================================
/**
 * STORY / INTUITION:
 * SAME pattern as Koko (#875) — binary search on the answer.
 * Answer space: [max(weights), sum(weights)]
 *   - Minimum: must fit heaviest single package (can't load it otherwise)
 *   - Maximum: load everything in one day
 *
 * canShip(cap, D): simulate loading — greedily fill each day.
 * If adding next package exceeds cap, start a new day.
 * Count days needed. If days ≤ D, capacity works.
 *
 * Monotone property: if cap C works, any cap > C also works.
 * → Binary search: if canShip(mid), try smaller (hi=mid). Else lo=mid+1.
 *
 * DRY RUN: weights=[1,2,3,4,5], days=3
 * lo=5(max), hi=15(sum) → mid=10
 * canShip(10,3): [1,2,3,4]→sum=10 day1, [5]→day2. 2 days ≤ 3 ✓ → hi=10
 * mid=7: [1,2,3]→6 day1, [4]→4 day2, [5]→5 day3. 3 days ≤ 3 ✓ → hi=7
 * mid=6: [1,2,3]→6 day1, [4]→4 day2, [5]→5 day3. 3 days ≤ 3 ✓ → hi=6
 * mid=5: [1,2]→3 day1, [3]→3 day2, [4]→4 day3, [5]→5 day4. 4>3 ✗ → lo=6
 * lo==hi=6 → Answer: 6 ✓
 *
 * Time:  O(N log(sum-max))
 * Space: O(1)
 */
const shipWithinDays = (weights, days) => {
  const canShip = (cap) => {
    let daysNeeded = 1;
    let load = 0;
    for (const w of weights) {
      if (load + w > cap) { daysNeeded++; load = 0; }
      load += w;
    }
    return daysNeeded <= days;
  };

  let lo = Math.max(...weights);                  // must fit heaviest item
  let hi = weights.reduce((s, w) => s + w, 0);   // all in one day

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canShip(mid)) hi = mid;
    else lo = mid + 1;
  }

  return lo;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Capacity to Ship Packages Tests ===\n");

console.log("Test 1:", shipWithinDays([1,2,3,4,5,6,7,8,9,10], 5)); // Expected: 15
console.log("Test 2:", shipWithinDays([3,2,2,4,1,4], 3));           // Expected: 6
console.log("Test 3:", shipWithinDays([1,2,3,1,1], 4));             // Expected: 3

module.exports = { shipWithinDays };
