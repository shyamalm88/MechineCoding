/**
 * ============================================================================
 * PROBLEM: Task Scheduler (LeetCode #621)
 * ============================================================================
 * Given a list of tasks (chars 'A'-'Z') and a cooldown n, find the minimum
 * number of CPU intervals (including idle) needed to execute all tasks.
 * Same task must be separated by at least n intervals.
 *
 * Example 1:
 * Input: tasks=["A","A","A","B","B","B"], n=2
 * Output: 8   → A B _ A B _ A B
 *
 * Example 2:
 * Input: tasks=["A","A","A","B","B","B"], n=0
 * Output: 6   → no cooldown needed
 *
 * Example 3:
 * Input: tasks=["A","A","A","A","B","B","B","C","C","D","D","E"], n=2
 * Output: 12
 *
 * Constraints:
 * - 1 <= task.length <= 10^4
 * - tasks[i] is uppercase English letters
 * - 0 <= n <= 100
 */

// ============================================================================
// APPROACH: Max-Heap + Cooldown Queue (Simulation)
// ============================================================================
/**
 * STORY / INTUITION:
 * At each CPU cycle, greedily pick the task with the HIGHEST remaining frequency
 * (so the most "urgent" task goes first, minimizing total idle time).
 *
 * But a just-executed task must COOL DOWN for n cycles before it can run again.
 * Use a QUEUE to track tasks in cooldown: [remainingCount, readyAt_time].
 *
 * Each cycle:
 * 1. Pop max-freq task from heap → execute → decrement count.
 * 2. If count > 0, push to cooldown queue with readyAt = time + n + 1.
 * 3. If cooldown queue front is ready (readyAt <= time), push back to heap.
 * 4. If heap is empty (no ready task), CPU idles (time still advances).
 *
 * DRY RUN: tasks=[A,A,A,B,B,B], n=2
 * Freq: A=3, B=3. Heap: [3,3]
 * t=1: run A(3→2). queue=[(2, t=4)]. heap=[3]. result=1
 * t=2: run B(3→2). queue=[(2,4),(2,5)]. heap=[]. result=2
 * t=3: heap empty, IDLE. Check queue: (2,4) not ready. result=3
 * t=4: (2,4) ready → push A back. run A(2→1). queue=[(2,5),(1,7)]. heap=[2→B]. result=4
 * t=5: (2,5) ready → push B back. run B(2→1). queue=[(1,7),(1,8)]. heap=[]. result=5
 * t=6: IDLE. result=6
 * t=7: A ready. run A(1→0). queue=[(1,8)]. result=7
 * t=8: B ready. run B(1→0). queue=[]. result=8
 * Answer: 8 ✓
 *
 * Time:  O(N log 26) = O(N) since at most 26 distinct tasks
 * Space: O(26) = O(1)
 */

class MaxHeap {
  constructor() { this.h = []; }
  size() { return this.h.length; }
  push(x) {
    this.h.push(x);
    let i = this.h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.h[p] >= this.h[i]) break;
      [this.h[p], this.h[i]] = [this.h[i], this.h[p]];
      i = p;
    }
  }
  pop() {
    if (this.h.length === 1) return this.h.pop();
    const top = this.h[0];
    this.h[0] = this.h.pop();
    let i = 0;
    while (true) {
      let s = i, l = 2*i+1, r = 2*i+2;
      if (l < this.h.length && this.h[l] > this.h[s]) s = l;
      if (r < this.h.length && this.h[r] > this.h[s]) s = r;
      if (s === i) break;
      [this.h[i], this.h[s]] = [this.h[s], this.h[i]];
      i = s;
    }
    return top;
  }
}

const leastInterval = (tasks, n) => {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;

  const heap = new MaxHeap();
  for (const f of freq) if (f > 0) heap.push(f);

  const queue = []; // [remainingCount, readyAtTime]
  let time = 0;

  while (heap.size() > 0 || queue.length > 0) {
    time++;

    if (heap.size() > 0) {
      const count = heap.pop() - 1;
      if (count > 0) queue.push([count, time + n]);
    }
    // else: CPU idles (time still advances)

    // Release tasks from cooldown that are now ready
    if (queue.length > 0 && queue[0][1] === time) {
      heap.push(queue.shift()[0]);
    }
  }

  return time;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Task Scheduler Tests ===\n");

console.log("Test 1:", leastInterval(["A","A","A","B","B","B"], 2)); // Expected: 8
console.log("Test 2:", leastInterval(["A","A","A","B","B","B"], 0)); // Expected: 6
console.log("Test 3:", leastInterval(["A","A","A","B","C","D"], 1)); // Expected: 6

module.exports = { leastInterval };
