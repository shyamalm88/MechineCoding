// ============================================================================
// APPROACH: Two Maps — Prefer EXTENDING an Existing Run Over Starting a New One
// ============================================================================
/**
 * STORY / INTUITION:
 * Process numbers in order. For each number x you face exactly one decision:
 *
 *   (a) APPEND x to a run that currently ends at x-1, or
 *   (b) START a fresh run x, x+1, x+2 (needs all three to be available).
 *
 * The greedy rule is: ALWAYS PREFER (a).
 *
 * Two maps carry the state:
 *   count — how many of each value are still unused
 *   end   — how many runs currently END at each value (i.e. are hungry for
 *           value+1)
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * Appending is free: it consumes only x and leaves an equally hungry run
 * (now ending at x) behind, so the "capacity to absorb future numbers" is
 * unchanged. Starting a new run instead consumes x PLUS x+1 and x+2, and leaves
 * the old run stranded at length < 3 unless something else rescues it. So
 * appending is never worse — it dominates on every axis. Only when no run is
 * waiting for x are we forced into option (b), and if that fails too, no valid
 * split exists.
 *
 * DRY RUN: [1,2,3,3,4,5]
 * counts {1:1,2:1,3:2,4:1,5:1}
 * x=1: no run ends at 0 → start [1,2,3]. count{3:1,4:1,5:1}, end{3:1}
 * x=2: count[2] is 0 → already consumed, skip
 * x=3: count[3]=1. A run ends at 2? end[2]=0. Start [3,4,5]? 4 and 5 available
 *      → yes. end{3:1, 5:1}
 * x=3 (2nd): count[3] now 0 → skip
 * x=4, x=5: consumed → skip
 * → TRUE
 *
 * DRY RUN: [1,2,3,4,4,5]  → after [1,2,3] is formed, the stray 4 finds a run
 * ending at 3 and extends it to [1,2,3,4]; the second 4 has no run at 3 left
 * and cannot start [4,5,6] (no 6) → FALSE
 *
 * Time:  O(N)
 * Space: O(N) for the two maps
 */
const isPossible = (nums) => {
  const count = new Map(); // values still unused
  const end = new Map();   // runs waiting to be extended by value+1

  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);

  for (const n of nums) {
    if ((count.get(n) || 0) === 0) continue; // already absorbed
    count.set(n, count.get(n) - 1);

    if ((end.get(n - 1) || 0) > 0) {
      // (a) Extend a hungry run — always preferred, costs nothing extra.
      end.set(n - 1, end.get(n - 1) - 1);
      end.set(n, (end.get(n) || 0) + 1);
    } else if ((count.get(n + 1) || 0) > 0 && (count.get(n + 2) || 0) > 0) {
      // (b) Forced to open a new run of the minimum legal length, 3.
      count.set(n + 1, count.get(n + 1) - 1);
      count.set(n + 2, count.get(n + 2) - 1);
      end.set(n + 2, (end.get(n + 2) || 0) + 1);
    } else {
      // Cannot extend and cannot start → this number is orphaned.
      return false;
    }
  }

  return true;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Split Array into Consecutive Subsequences Tests ===\n");

console.log("Test 1:", isPossible([1, 2, 3, 3, 4, 5]));          // Expected: true
console.log("Test 2:", isPossible([1, 2, 3, 3, 4, 4, 5, 5]));    // Expected: true
console.log("Test 3:", isPossible([1, 2, 3, 4, 4, 5]));          // Expected: false
console.log("Test 4:", isPossible([1, 2, 3]));                   // Expected: true
console.log("Test 5:", isPossible([1, 2]));                      // Expected: false (too short)
console.log("Test 6:", isPossible([1, 2, 3, 4, 5, 6]));          // Expected: true (one long run)

module.exports = { isPossible };
