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
    this.queue = [];
    this.running = false;
  }

  add(task, priority = 0) {
    this.queue.push({ task, priority });
    // Sort descending by priority
    this.queue.sort((a, b) => b.priority - a.priority);
    this.run();
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const { task } = this.queue.shift();
      try {
        await task();
      } catch (error) {
        console.error("Task failed:", error);
      }
    }

    this.running = false;
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
