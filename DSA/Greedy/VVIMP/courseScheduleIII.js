/**
 * ============================================================================
 * PROBLEM: Course Schedule III (LeetCode #630)
 * ============================================================================
 * courses[i] = [duration_i, lastDay_i] means course i takes duration_i days
 * and must be FINISHED on or before lastDay_i. You start on day 1 and can take
 * only one course at a time. Return the maximum number of courses you can take.
 *
 * Example 1:
 * Input: courses = [[100,200],[200,1300],[1000,1250],[2000,3200]] → Output: 3
 * Example 2:
 * Input: courses = [[1,2]] → Output: 1
 * Example 3:
 * Input: courses = [[3,2],[4,3]] → Output: 0
 *
 * Constraints:
 * - 1 <= courses.length <= 10^4
 * - 1 <= duration_i, lastDay_i <= 10^4
 */

// ============================================================================
// APPROACH: Sort by Deadline + Max-Heap "Regret" Swap
// ============================================================================
/**
 * STORY / INTUITION:
 * Sort by DEADLINE ascending and consider courses in that order — a deadline is
 * a hard wall, and there is never a reason to consider a later-deadline course
 * before an earlier one.
 *
 * Take each course optimistically. When one no longer fits, do NOT simply drop
 * it — that is where a naive greedy fails. Instead ask: is this new course
 * SHORTER than the longest course I have already committed to? If so, swap them.
 * Course COUNT is unchanged, but total time spent drops, which frees room for
 * everything still to come. This "undo my worst past decision" move is called a
 * REGRET heap, and it is the pattern worth internalising here.
 *
 * A max-heap keyed on duration gives O(log N) access to that worst commitment.
 *
 * WHY THE GREEDY CHOICE IS SAFE:
 * Invariant: after processing the first i courses, the heap holds a maximum-size
 * feasible set among them AND, among all such maximum-size sets, one with the
 * smallest total duration. Both halves matter — minimal total time is what keeps
 * the most room available for future courses, so a maximum-size set with minimum
 * time is never worse than any other maximum-size set. The swap step preserves
 * exactly this: size stays the same, time strictly decreases.
 *
 * Note we only need `time + duration <= lastDay` (not per-course start times),
 * because courses taken in deadline order can always be scheduled back-to-back.
 *
 * DRY RUN: [[100,200],[200,1300],[1000,1250],[2000,3200]]
 * sorted by deadline → [100,200], [1000,1250], [200,1300], [2000,3200]
 * [100,200]:   0+100 = 100 <= 200   → take.  time=100,  heap{100}
 * [1000,1250]: 100+1000 = 1100 <= 1250 → take. time=1100, heap{1000,100}
 * [200,1300]:  1100+200 = 1300 <= 1300 → take. time=1300, heap{1000,200,100}
 * [2000,3200]: 1300+2000 = 3300 > 3200 → doesn't fit.
 *              Is 2000 < heap max 1000? No → skip.
 * heap size 3 → answer 3
 *
 * Time:  O(N log N)
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

const scheduleCourse = (courses) => {
  // Earliest deadline first — the wall you hit soonest constrains you most.
  courses.sort((a, b) => a[1] - b[1]);

  const taken = new MaxHeap(); // durations of committed courses
  let time = 0;

  for (const [duration, lastDay] of courses) {
    if (time + duration <= lastDay) {
      // Fits outright.
      taken.push(duration);
      time += duration;
    } else if (taken.size > 0 && taken.peek() > duration) {
      // REGRET: swap out the longest course taken so far. Same count, less
      // time consumed, so more room for the courses still ahead.
      time += duration - taken.pop();
      taken.push(duration);
    }
    // Otherwise this course is longer than anything we regret — skip it.
  }

  return taken.size;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Course Schedule III Tests ===\n");

console.log("Test 1:", scheduleCourse([[100, 200], [200, 1300], [1000, 1250], [2000, 3200]])); // Expected: 3
console.log("Test 2:", scheduleCourse([[1, 2]]));               // Expected: 1
console.log("Test 3:", scheduleCourse([[3, 2], [4, 3]]));       // Expected: 0
console.log("Test 4:", scheduleCourse([[5, 5], [4, 6], [2, 6]])); // Expected: 2 (swap the 5 for the 2)
console.log("Test 5:", scheduleCourse([[1, 2], [2, 3]]));       // Expected: 2

module.exports = { scheduleCourse, MaxHeap };
