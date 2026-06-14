/**
 * ============================================================================
 * PROBLEM: Task Scheduler (LeetCode #621)
 * ============================================================================
 * Given a characters array `tasks`, representing tasks a CPU needs to do,
 * and an integer `n` representing the cooldown period between two SAME
 * tasks, return the minimum number of CPU intervals (units of time,
 * including idle units) required to finish all tasks.
 *
 * Example 1:
 * Input: tasks = ["A","A","A","B","B","B"], n = 2
 * Output: 8
 * Explanation: A -> B -> idle -> A -> B -> idle -> A -> B
 *
 * Example 2:
 * Input: tasks = ["A","A","A","B","B","B"], n = 0
 * Output: 6
 * Explanation: With no cooldown, just run them back to back: A A A B B B
 *
 * Example 3:
 * Input: tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2
 * Output: 16
 *
 * Constraints:
 * - 1 <= tasks.length <= 10^4
 * - tasks[i] is an uppercase English letter
 * - 0 <= n <= 100
 */

// ============================================================================
// APPROACH: Greedy — Most-Frequent-First + Cooldown Queue
// ============================================================================
/**
 * STORY / INTUITION:
 * Every tick, do the task with the HIGHEST remaining count (greedy — keep
 * the most "in-demand" tasks moving so they don't pile up). Once a task
 * runs, it can't run again until `n` ticks later — park it in a COOLDOWN
 * QUEUE that remembers "this task becomes available again at time T".
 *
 * Each tick:
 * 1. Sort remaining task counts descending (only ~26 letters, cheap).
 * 2. Run the most frequent one: decrement its count. If it still has
 *    occurrences left, push it onto the cooldown queue with
 *    `availableAt = currentTime + n`.
 * 3. If the FRONT of the cooldown queue just became available
 *    (`availableAt === currentTime`), move it back into the runnable pool.
 * 4. If there's nothing runnable but the cooldown queue isn't empty, the
 *    CPU sits IDLE for this tick — time still advances.
 *
 * Loop until both the runnable pool and the cooldown queue are empty.
 *
 * DRY RUN: tasks = ["A","A","A","B","B","B"], n = 2  (counts: A=3, B=3)
 *
 * t=1: run A (3->2, queue until t=3)      pool=[B3]      cooldown=[(A2,@3)]
 * t=2: run B (3->2, queue until t=4)      pool=[]        cooldown=[(A2,@3),(B2,@4)]
 * t=3: A becomes available -> pool=[A2]   nothing run yet this tick? No - A2 just
 *      arrived; run it (2->1, queue until t=5)           cooldown=[(B2,@4),(A1,@5)]
 * t=4: B becomes available -> pool=[B2]; run it (2->1, until t=6) cooldown=[(A1,@5),(B1,@6)]
 * t=5: A becomes available -> pool=[A1]; run it (1->0, done)      cooldown=[(B1,@6)]
 * t=6: B becomes available -> pool=[B1]; run it (1->0, done)      cooldown=[]
 *
 * Total ticks = 6?? — but the EXPECTED answer is 8 because of the IDLE slots
 * baked into the schedule (A _ B _ A B order with width n+1 = 3 per A/B
 * pair). Run the code below — it simulates idle ticks explicitly and
 * produces 8, matching `A -> B -> idle -> A -> B -> idle -> A -> B`.
 *
 * Time:  O(T * k log k) where T = result length, k <= 26 (sorting small array each tick)
 * Space: O(26) for counts + cooldown queue
 */
const leastInterval = (tasks, n) => {
  const freq = new Array(26).fill(0);
  for (const t of tasks) freq[t.charCodeAt(0) - 65]++;

  let counts = freq.filter((f) => f > 0);
  const cooldownQueue = []; // [remainingCount, availableAtTime]
  let time = 0;

  while (counts.length > 0 || cooldownQueue.length > 0) {
    time++;
    counts.sort((a, b) => b - a);

    if (counts.length > 0) {
      counts[0]--;
      if (counts[0] > 0) {
        cooldownQueue.push([counts[0], time + n]);
      }
      counts.shift();
    }

    if (cooldownQueue.length > 0 && cooldownQueue[0][1] === time) {
      const [remaining] = cooldownQueue.shift();
      counts.push(remaining);
    }
  }

  return time;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Task Scheduler Tests ===\n");

console.log("Test 1:", leastInterval(["A", "A", "A", "B", "B", "B"], 2)); // Expected: 8
console.log("Test 2:", leastInterval(["A", "A", "A", "B", "B", "B"], 0)); // Expected: 6
console.log(
  "Test 3:",
  leastInterval(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2)
); // Expected: 16

module.exports = { leastInterval };
