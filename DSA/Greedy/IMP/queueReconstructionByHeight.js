/**
 * ============================================================================
 * PROBLEM: Queue Reconstruction by Height (LeetCode #406)
 * ============================================================================
 * You are given people[i] = [h_i, k_i], where h_i is the person's height and
 * k_i is the number of people IN FRONT of them who have a height greater than
 * or equal to h_i. Reconstruct and return the queue.
 *
 * Example 1:
 * Input:  [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
 * Output: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
 *
 * Example 2:
 * Input:  [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
 * Output: [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]
 *
 * Constraints:
 * - 1 <= people.length <= 2000
 * - 0 <= h_i <= 10^6
 * - 0 <= k_i < people.length
 * - The answer is guaranteed to exist
 */

// ============================================================================
// APPROACH: Tallest First, Then Insert at Index k
// ============================================================================
/**
 * STORY / INTUITION:
 * The k value is defined only in terms of people who are TALLER OR EQUAL. That
 * is the hook: shorter people are invisible to a taller person's count. So if
 * we place people from tallest to shortest, everyone already in the queue is
 * someone the newcomer can "see" — which means the newcomer's k IS their final
 * index. Just splice them in at position k.
 *
 * Sort by height DESC, and within equal heights by k ASC (a [5,0] must be
 * inserted before a [5,2], otherwise the [5,2] shifts the [5,0] rightwards and
 * breaks its count).
 *
 * WHY THE GREEDY CHOICE IS SAFE (the key invariant):
 * Inserting a SHORTER person later never disturbs an already-placed person's
 * count. Someone spliced in ahead of a taller person increases that person's
 * index by one, but not their k — because k only counts people >= their own
 * height, and the newcomer is strictly shorter. So every placement stays valid
 * forever. Processing tallest-first is what guarantees this one-way invariant.
 *
 * DRY RUN: [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
 * sorted → [[7,0],[7,1],[6,1],[5,0],[5,2],[4,4]]
 *   [7,0] at 0 → [[7,0]]
 *   [7,1] at 1 → [[7,0],[7,1]]
 *   [6,1] at 1 → [[7,0],[6,1],[7,1]]
 *   [5,0] at 0 → [[5,0],[7,0],[6,1],[7,1]]
 *   [5,2] at 2 → [[5,0],[7,0],[5,2],[6,1],[7,1]]
 *   [4,4] at 4 → [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
 *
 * Time:  O(N^2) — N splices, each shifting up to N elements
 * Space: O(N) for the output queue
 */
const reconstructQueue = (people) => {
  // Tallest first; ties broken by smaller k first so counts stay consistent.
  people.sort((a, b) => b[0] - a[0] || a[1] - b[1]);

  const queue = [];
  for (const person of people) {
    // Everyone already placed is >= this person's height, so k is the index.
    queue.splice(person[1], 0, person);
  }

  return queue;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Queue Reconstruction by Height Tests ===\n");

console.log("Test 1:", JSON.stringify(reconstructQueue([[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]])));
// Expected: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]

console.log("Test 2:", JSON.stringify(reconstructQueue([[6, 0], [5, 0], [4, 0], [3, 2], [2, 2], [1, 4]])));
// Expected: [[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]

console.log("Test 3:", JSON.stringify(reconstructQueue([[1, 0]])));
// Expected: [[1,0]]

console.log("Test 4:", JSON.stringify(reconstructQueue([[5, 0], [5, 1], [5, 2]])));
// Expected: [[5,0],[5,1],[5,2]] (all equal heights)

module.exports = { reconstructQueue };
