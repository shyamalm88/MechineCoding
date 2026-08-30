// ============================================================================
// APPROACH: Sort by Units Per Box Descending — Fractional Knapsack
// ============================================================================
/**
 * STORY / INTUITION:
 * Every box costs exactly the same amount of truck capacity: one slot. So the
 * only thing that distinguishes boxes is how many units they carry. Load the
 * densest boxes first until the truck is full.
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * This is FRACTIONAL knapsack, not 0/1 knapsack — and that difference is the
 * whole reason greedy works here. Because all items have identical weight and
 * a group can be split, exchange is always available: if an optimal loading
 * includes a box worth u1 while a box worth u2 > u1 sits unloaded, swap them.
 * Capacity used is unchanged and the total rises. So no optimal solution can
 * skip a denser box in favour of a lighter one. (Contrast 0/1 knapsack with
 * differing weights, where this swap can overflow capacity and greedy breaks —
 * that is exactly when you need DP.)
 *
 * DRY RUN: [[1,3],[2,2],[3,1]], truckSize = 4
 * sort by units desc → [[1,3],[2,2],[3,1]]
 * take min(1,4)=1 box × 3 = 3    units=3,  remaining=3
 * take min(2,3)=2 boxes × 2 = 4  units=7,  remaining=1
 * take min(3,1)=1 box × 1 = 1    units=8,  remaining=0 → stop
 * answer 8
 *
 * Time:  O(N log N) — the sort dominates
 * Space: O(1) extra (sorts in place)
 */
const maximumUnits = (boxTypes, truckSize) => {
  // Densest boxes first — capacity is per-box, so units-per-box is the only
  // thing worth ranking on.
  boxTypes.sort((a, b) => b[1] - a[1]);

  let units = 0;
  let remaining = truckSize;

  for (const [boxCount, unitsPerBox] of boxTypes) {
    if (remaining === 0) break;
    // Partial groups are allowed — take as many as still fit.
    const take = Math.min(boxCount, remaining);
    units += take * unitsPerBox;
    remaining -= take;
  }

  return units;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Maximum Units on a Truck Tests ===\n");

console.log("Test 1:", maximumUnits([[1, 3], [2, 2], [3, 1]], 4));            // Expected: 8
console.log("Test 2:", maximumUnits([[5, 10], [2, 5], [4, 7], [3, 9]], 10));  // Expected: 91
console.log("Test 3:", maximumUnits([[1, 1]], 1));                            // Expected: 1
console.log("Test 4:", maximumUnits([[2, 5]], 10));                           // Expected: 10 (truck bigger than supply)
console.log("Test 5:", maximumUnits([[3, 4], [1, 9]], 2));                    // Expected: 13 (9 + 4)

module.exports = { maximumUnits };
