/**
 * ============================================================================
 * PROBLEM: Priority Executor with Concurrency Limit
 * ============================================================================
 * Implement a scheduler that:
 * 1. Allows adding async tasks with a priority.
 * 2. Limits the number of tasks running concurrently.
 * 3. When a slot becomes available, starts the highest priority task from the queue.
 *
 * ============================================================================
 * INTUITION: Priority Queue + Concurrency Control
 * ============================================================================
 * This combines two patterns:
 * 1. Concurrency Limiter:
 *    - Maintain `running` count.
 *    - Only start new tasks if `running < limit`.
 *    - When a task finishes, decrement `running` and try to start the next one.
 *
 * 2. Priority Queue:
 *    - Instead of a FIFO queue (array.push/shift), we need to ensure the
 *      next task picked is the one with the highest priority.
 *    - We can sort the queue every time we add a task (O(N log N)).
 *    - Or use a Max Heap (O(log N)) for better performance in production.
 *
 * FLOW:
 * - `add(task, priority)`:
 *   1. Create a wrapper that manages the task lifecycle (start, resolve/reject, finally).
 *   2. Push wrapper to queue.
 *   3. Sort queue by priority (descending).
 *   4. Try to run tasks (`_drain`).
 *   5. Return a promise that settles when the task eventually runs and finishes.
 *
 * - `_drain()`:
 *   1. While `running < limit` and `queue` has tasks:
 *      - Pop highest priority task.
 *      - Increment `running`.
 *      - Execute task.
 */
class PriorityExecutorConcurrent {
  constructor(limit = 2) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      const runTask = async () => {
        this.running++;
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          this.running--;
          this._drain();
        }
      };

      // enqueue with priority
      this.queue.push({ runTask, priority });

      // higher priority first
      this.queue.sort((a, b) => b.priority - a.priority);

      this._drain();
    });
  }

  _drain() {
    while (this.running < this.limit && this.queue.length > 0) {
      const { runTask } = this.queue.shift();
      runTask();
    }
  }
}

export { PriorityExecutorConcurrent }
