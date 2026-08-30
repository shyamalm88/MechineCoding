/**
 * ============================================================================
 * PROBLEM: IPO (LeetCode #502)
 * ============================================================================
 * You have w units of starting capital and may finish AT MOST k distinct
 * projects. Project i requires capital[i] to start and yields a pure profit of
 * profits[i], which is added to your capital when finished. Projects cannot be
 * repeated. Return the maximum capital you can end with.
 *
 * Example 1:
 * Input: k = 2, w = 0, profits = [1,2,3], capital = [0,1,1] → Output: 4
 * (Start project 0 → capital 1. Now project 2 is affordable → capital 4.)
 *
 * Example 2:
 * Input: k = 3, w = 0, profits = [1,2,3], capital = [0,1,2] → Output: 6
 *
 * Constraints:
 * - 1 <= k <= 10^5
 * - 0 <= w <= 10^9
 * - 1 <= profits.length == capital.length <= 10^5
 */

// ============================================================================
// APPROACH: Sort by Capital, Max-Heap on Profit — "Unlock, Then Take the Best"
// ============================================================================
/**
 * STORY / INTUITION:
 * Two forces pull against each other: a project must be AFFORDABLE (capital
 * gate) and you want it to be PROFITABLE. Sorting by one ruins the other, so
 * use a different structure for each:
 *
 *   - Sort projects by required capital ASC. A moving pointer walks this list
 *     and "unlocks" every project you can now afford. Because w only ever grows,
 *     the pointer never rewinds — each project is unlocked at most once.
 *   - Push unlocked projects' profits into a MAX-HEAP. Each round, take the top.
 *
 * Repeat k times, or stop early when the heap is empty (nothing affordable is
 * left, and since w cannot grow without finishing a project, it never will be).
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * Profits are non-negative, so capital is monotonically non-decreasing. That
 * means the set of affordable projects only ever GROWS — taking the most
 * profitable one now never locks you out of anything later. Formally: if an
 * optimal plan takes project p while a strictly more profitable affordable
 * project q is available, swapping p for q leaves capital at least as high at
 * every subsequent step, so every later choice in the optimal plan remains
 * affordable. Greedy is therefore never behind.
 *
 * DRY RUN: k=2, w=0, profits=[1,2,3], capital=[0,1,1]
 * sorted by capital → [(0,1), (1,2), (1,3)]
 * round 1: unlock capital <= 0 → push 1. heap {1}. pop 1 → w = 1
 * round 2: unlock capital <= 1 → push 2, push 3. heap {3,2}. pop 3 → w = 4
 * answer 4
 *
 * Time:  O(N log N) — sort plus at most N heap pushes/pops
 * Space: O(N)
 */

/** Minimal binary max-heap — the files here are self-contained by convention. */
class MaxHeap {
  constructor() {
    this.data = [];
  }

  get size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  push(value) {
    this.data.push(value);
    let i = this.data.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent] >= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  pop() {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      for (;;) {
        const left = 2 * i + 1;
        const right = left + 1;
        let largest = i;
        if (left < this.data.length && this.data[left] > this.data[largest]) largest = left;
        if (right < this.data.length && this.data[right] > this.data[largest]) largest = right;
        if (largest === i) break;
        [this.data[largest], this.data[i]] = [this.data[i], this.data[largest]];
        i = largest;
      }
    }
    return top;
  }
}

const findMaximizedCapital = (k, w, profits, capital) => {
  // Pair them up and order by the capital gate.
  const projects = profits
    .map((profit, i) => [capital[i], profit])
    .sort((a, b) => a[0] - b[0]);

  const affordable = new MaxHeap();
  let next = 0; // never rewinds: capital only grows

  for (let round = 0; round < k; round++) {
    // Unlock everything the current capital can reach.
    while (next < projects.length && projects[next][0] <= w) {
      affordable.push(projects[next][1]);
      next++;
    }

    // Nothing affordable → capital can never grow again, so stop.
    if (affordable.size === 0) break;

    w += affordable.pop();
  }

  return w;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== IPO Tests ===\n");

console.log("Test 1:", findMaximizedCapital(2, 0, [1, 2, 3], [0, 1, 1])); // Expected: 4
console.log("Test 2:", findMaximizedCapital(3, 0, [1, 2, 3], [0, 1, 2])); // Expected: 6
console.log("Test 3:", findMaximizedCapital(1, 0, [1, 2, 3], [1, 1, 2])); // Expected: 0 (nothing affordable)
console.log("Test 4:", findMaximizedCapital(1, 2, [1, 2, 3], [1, 1, 2])); // Expected: 5 (take the 3)
console.log("Test 5:", findMaximizedCapital(10, 0, [1, 2, 3], [0, 1, 2])); // Expected: 6 (k exceeds supply)

module.exports = { findMaximizedCapital, MaxHeap };
