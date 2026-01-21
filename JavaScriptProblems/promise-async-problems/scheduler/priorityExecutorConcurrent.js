/**
 * ============================================================================
 * PROBLEM: Concurrent Priority Scheduler
 * ============================================================================
 * Implement a scheduler that:
 * 1. Limits concurrent tasks to `limit`.
 * 2. Executes waiting tasks based on priority (Highest first).
 *
 * ============================================================================
 * INTUITION: Priority Queue + Concurrency Control
 * ============================================================================
 * Combines the logic of AsyncScheduler and PriorityExecutorConcurrent.
 *
 * 1. `add(task, priority)`: Push to queue, Sort queue, Try to run.
 * 2. `run()`:
 *    - While `running < limit` and `queue` has items:
 *      - Pop highest priority task.
 *      - Increment `running`.
 *      - Execute.
 *      - On completion (`finally`), decrement `running` and call `run()` recursively.
 */
class PriorityExecutorConcurrent {
  constructor(limit = 2) {
    this.queue = [];
    this.running = 0;
    this.limit = limit;
  }

  add(task, priority = 0) {
    this.queue.push({ task, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.run();
  }

  run() {
    while (this.running < this.limit && this.queue.length > 0) {
      const { task } = this.queue.shift();
      this.running++;

      // Wrap in Promise.resolve to handle both sync and async tasks safely
      Promise.resolve(task()).finally(() => {
        this.running--;
        this.run();
      });
    }
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
const concurrentExecutor = new PriorityExecutorConcurrent(2); // Limit 2 concurrent tasks

const createAsyncTask = (id, priority, delay) => async () => {
  console.log(`[${id}] Start (Priority: ${priority})`);
  await new Promise((r) => setTimeout(r, delay));
  console.log(`[${id}] End`);
};

// 1. Add tasks. First 2 start immediately.
concurrentExecutor.add(createAsyncTask("A", 1, 300), 1);
concurrentExecutor.add(createAsyncTask("B", 10, 100), 10);

// 2. Add more tasks. These are queued.
concurrentExecutor.add(createAsyncTask("C", 5, 100), 5);
concurrentExecutor.add(createAsyncTask("D", 20, 100), 20);

// Expected Execution Flow:
// 1. A and B start immediately (Concurrency limit 2).
// 2. Queue has C (5) and D (20). Sorted -> [D, C].
// 3. B finishes (100ms). Slot opens.
// 4. D starts (Priority 20 is highest in queue).
// 5. C waits for next slot.
