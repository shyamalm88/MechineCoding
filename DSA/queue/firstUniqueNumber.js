/**
 * ============================================================================
 * PROBLEM: First Unique Number (LeetCode #1429)
 * ============================================================================
 * Implement FirstUnique:
 * - FirstUnique(int[] nums): initializes with the numbers in the queue.
 * - int showFirstUnique(): returns the value of the first unique integer in
 *   the queue, or -1 if there is none.
 * - void add(int value): inserts value at the back of the queue.
 *
 * Example:
 * Input:
 * ["FirstUnique","showFirstUnique","add","showFirstUnique","add","showFirstUnique","add","showFirstUnique"]
 * [[[2,3,5]],[],[5],[],[2],[],[3],[]]
 *
 * Output: [null,2,null,2,null,3,null,-1]
 *
 * Explanation:
 * FirstUnique fu = new FirstUnique([2,3,5]);
 * fu.showFirstUnique(); // 2          queue=[2,3,5], all unique, 2 is first
 * fu.add(5);            // queue=[2,3,5,5]
 * fu.showFirstUnique(); // 2          2 still first AND still unique
 * fu.add(2);            // queue=[2,3,5,5,2]
 * fu.showFirstUnique(); // 3          2 is no longer unique, 3 is next
 * fu.add(3);            // queue=[2,3,5,5,2,3]
 * fu.showFirstUnique(); // -1         no unique numbers remain
 *
 * Constraints:
 * - 1 <= nums.length <= 10^5
 * - 1 <= value <= 10^8
 * - At most 10^5 calls to add and showFirstUnique
 */

// ============================================================================
// APPROACH: Queue of Candidates + HashMap of Frequencies (Lazy Eviction)
// ============================================================================
/**
 * STORY / INTUITION:
 * Re-scanning the whole queue on every `showFirstUnique()` call would be
 * O(N) per call — too slow for 10^5 calls. Instead, keep TWO structures:
 *
 * - `freq` (Map): value -> how many times it has been seen TOTAL.
 * - `candidates` (Queue): values in the order they FIRST appeared. A value
 *   is pushed here ONLY the first time it's seen — repeats don't re-push.
 *
 * The front of `candidates` is the BEST GUESS for "first unique" — but it
 * might be STALE (its frequency could have grown past 1 since it was
 * queued). So `showFirstUnique()` lazily evicts stale entries: while the
 * front's frequency > 1, dequeue it (it can never be useful again — once a
 * value repeats, it's disqualified forever). The first entry that survives
 * (frequency === 1) is the true answer; if the queue empties, return -1.
 *
 * Because each value is pushed at most once and popped at most once, the
 * TOTAL eviction work across all calls is O(N), making every operation
 * effectively O(1) amortized.
 *
 * DRY RUN: constructor([2,3,5]) -> freq={2:1,3:1,5:1}, candidates=[2,3,5]
 *
 * showFirstUnique(): front=2 (freq 1) -> return 2
 * add(5): freq[5]=2 (already seen once, don't re-push) -> candidates=[2,3,5]
 * showFirstUnique(): front=2 (freq 1) -> return 2
 * add(2): freq[2]=2 (already seen, don't re-push) -> candidates=[2,3,5]
 * showFirstUnique(): front=2 (freq 2, STALE) -> evict.
 *                     front=3 (freq 1) -> return 3
 * add(3): freq[3]=2 -> candidates=[3,5] (2 already evicted)
 * showFirstUnique(): front=3 (freq 2, STALE) -> evict.
 *                     front=5 (freq 2, STALE) -> evict.
 *                     queue empty -> return -1
 *
 * Time:  O(1) amortized for add(); O(1) amortized for showFirstUnique()
 * Space: O(N) — freq map + candidates queue
 */
class FirstUnique {
  constructor(nums) {
    this.freq = new Map();
    this.candidates = [];

    for (const num of nums) {
      this._record(num);
    }
  }

  _record(value) {
    const seenBefore = this.freq.has(value);
    this.freq.set(value, (this.freq.get(value) || 0) + 1);
    if (!seenBefore) {
      this.candidates.push(value);
    }
  }

  showFirstUnique() {
    while (this.candidates.length > 0 && this.freq.get(this.candidates[0]) > 1) {
      this.candidates.shift();
    }
    return this.candidates.length > 0 ? this.candidates[0] : -1;
  }

  add(value) {
    this._record(value);
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== First Unique Number Tests ===\n");

const fu = new FirstUnique([2, 3, 5]);
console.log("Test 1:", fu.showFirstUnique()); // Expected: 2
fu.add(5);
console.log("Test 2:", fu.showFirstUnique()); // Expected: 2
fu.add(2);
console.log("Test 3:", fu.showFirstUnique()); // Expected: 3
fu.add(3);
console.log("Test 4:", fu.showFirstUnique()); // Expected: -1

module.exports = { FirstUnique };
