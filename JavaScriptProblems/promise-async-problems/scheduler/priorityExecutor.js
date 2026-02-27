/**
 * ============================================================================
 * PROBLEM: Priority Task Executor (Sequential)
 * ============================================================================
 * Implement a task executor that runs tasks one by one based on priority.
 * - Higher priority tasks run first.
 * - If priorities are equal, FIFO (First-In-First-Out).
 *
 * ============================================================================
 * INTUITION: Priority Queue
 * ============================================================================
 * 1. Store tasks as objects `{ task, priority }`.
 * 2. When adding a task, push to array and sort by priority (descending).
 *    - Note: For production, a Heap/PriorityQueue data structure is O(log N).
 *      Array sorting is O(N log N) or O(N) depending on insertion strategy.
 * 3. Execution loop (`run`):
 *    - Check if already running (concurrency = 1).
 *    - While queue is not empty:
 *      - Shift the highest priority task.
 *      - `await` its completion.
 *      - Repeat.
 */
class PriorityExecutor {
  constructor() {
    this.limit = 1;
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

      this.queue.push({ runTask, priority });
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

// ============================================================================
// TEST CASES
// ============================================================================
const executor = new PriorityExecutor();

const createTask = (id, delay) => () =>
  new Promise((resolve) => {
    console.log(`Start: ${id}`);
    setTimeout(() => {
      console.log(`End: ${id}`);
      resolve();
    }, delay);
  });

// 1. Add a low priority task (Starts immediately because queue is empty)
executor.add(createTask("Task 1 (Priority 1)", 500), 1);

// 2. Add a high priority task (Queued because Task 1 is running)
executor.add(createTask("Task 2 (Priority 10)", 100), 10);

// 3. Add a medium priority task (Queued and sorted behind Task 2)
executor.add(createTask("Task 3 (Priority 5)", 100), 5);

// Expected Output:
// Start: Task 1 (Priority 1)
// End: Task 1
// Start: Task 2 (Priority 10) - Highest in queue
// End: Task 2
// Start: Task 3 (Priority 5)
// End: Task 3
