/**
 * ============================================================================
 * PROBLEM: Boats to Save People (LeetCode #881)
 * ============================================================================
 * Each boat can carry at most 2 people, with weight limit `limit`.
 * Given people[] (their weights), return the minimum number of boats needed.
 *
 * Example 1:
 * Input: people=[1,2], limit=3 → Output: 1  (both on one boat)
 *
 * Example 2:
 * Input: people=[3,2,2,1], limit=3 → Output: 3  ([3],[2,1],[2])
 *
 * Example 3:
 * Input: people=[3,5,3,4], limit=5 → Output: 4  ([3],[5],[3],[4]? No: [3,2]? no limit=5)
 *   Actually: [3+2 no, limit 5] → [5],[4],[3,1]→ but we don't have 1... wait
 *   people=[3,5,3,4], limit=5: sort=[3,3,4,5], [3+2?] no → [3,?] 3+3>5 no → [3 alone],[3 alone],[4 alone],[5 alone] → 4? No: [5 alone],[4 alone],[3 alone],[3 alone]=4 or [5],[3,? 3+3>5 no],[4? no],[3] → 4
 *
 * Constraints:
 * - 1 <= people.length <= 5 * 10^4
 * - 1 <= people[i] <= limit <= 3 * 10^4
 */

// ============================================================================
// APPROACH: Sort + Two Pointers (Greedy)
// ============================================================================
/**
 * STORY / INTUITION:
 * Greedy insight: Try to pair the HEAVIEST person with the LIGHTEST person.
 * - If they fit together (heaviest + lightest <= limit) → both share a boat.
 * - If they don't fit → heaviest must go ALONE (no one lighter can help them fit).
 *
 * Why pair heaviest with lightest?
 * The heaviest person MUST go on some boat. If we can pair them with anyone,
 * the lightest person is the best candidate (minimizes wasted space and boat count).
 *
 * Sort first, then two pointers from both ends.
 *
 * DRY RUN: people=[3,2,2,1], limit=3 → sorted=[1,2,2,3]
 * l=0(1), r=3(3): 1+3=4>3 → 3 alone. boats=1. r=2.
 * l=0(1), r=2(2): 1+2=3<=3 → pair. boats=2. l=1, r=1.
 * l==r: 1 person left. boats=3. l=2.
 * l>r: done. Result: 3 ✓
 *
 * Time:  O(N log N) for sort
 * Space: O(1)
 */
const numRescueBoats = (people, limit) => {
  people.sort((a, b) => a - b);
  let left = 0, right = people.length - 1;
  let boats = 0;

  while (left <= right) {
    if (people[left] + people[right] <= limit) {
      left++; // lightest person can pair with heaviest
    }
    right--;  // heaviest always takes a boat
    boats++;
  }

  return boats;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Boats to Save People Tests ===\n");

console.log("Test 1:", numRescueBoats([1, 2], 3));          // Expected: 1
console.log("Test 2:", numRescueBoats([3, 2, 2, 1], 3));    // Expected: 3
console.log("Test 3:", numRescueBoats([3, 5, 3, 4], 5));    // Expected: 4
console.log("Test 4:", numRescueBoats([2, 2, 2, 2], 4));    // Expected: 2

module.exports = { numRescueBoats };
