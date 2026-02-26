/**
 * ============================================================================
 * PROBLEM: Executor with Concurrency Limit
 * ============================================================================
 * Implement a task executor that limits the number of concurrent async tasks.
 *
 * Features:
 * 1. `push(task)`: Adds a task to the executor. Returns a Promise that resolves
 *    when the task completes.
 * 2. `concurrency`: Maximum number of tasks running in parallel.
 * 3. Queueing: If limit is reached, tasks wait in a queue.
 *
 * ============================================================================
 * INTUITION: Queue + Counter + Closure
 * ============================================================================
 * 1. Maintain `running` count and a `queue` of pending tasks.
 * 2. When `push` is called, create a wrapper function `runTask`.
 *    - This wrapper increments `running`, executes the task, and handles
 *      resolution/rejection of the outer Promise.
 *    - Crucially, in `finally`, it decrements `running` and calls `_next()`.
 * 3. If `running < concurrency`, execute `runTask` immediately.
 * 4. Otherwise, push `runTask` to the queue.
 * 5. `_next()` checks if there's space and pulls the next task from the queue.
 */

class Executor {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  /**
   * Adds a task to the executor.
   * @param {Function} task - A function that returns a Promise.
   * @returns {Promise} - Resolves with the task's result or rejects with its error.
   */
  push(task) {
    return new Promise((resolve, reject) => {
      // Define the execution logic for this specific task
      const runTask = async () => {
        this.running++;

        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        } finally {
          this.running--;
          this._next(); // Trigger the next task in the queue
        }
      };

      // Schedule execution

      if (this.running < this.concurrency) {
        runTask();
      } else {
        this.queue.push(runTask);
      }
    });
  }
  /**
   * Internal method to process the next task in the queue.
   */
  _next() {
    // Stop if queue is empty or we reached concurrency limit
    if (this.queue.length === 0 || this.running >= this.concurrency) {
      return;
    }

    const nextTask = this.queue.shift();
    nextTask();
  }
}

// ============================================================================
// TEST CASES
// ============================================================================

const ex = new Executor(3); // Limit concurrency to 3

const createTask = (id, delay) => async () => {
  console.log(`[${new Date().toISOString()}] Start ${id}`);
  await new Promise((r) => setTimeout(r, delay));
  console.log(`[${new Date().toISOString()}] End ${id}`);
  return `Result: ${id}`;
};

console.log("Adding tasks...");

// Tasks t1, t2, t3 start immediately
ex.push(createTask("t1", 1000));
ex.push(createTask("t2", 500));
ex.push(createTask("t3", 800));

// Tasks t4-t7 are queued
ex.push(createTask("t4", 400));
ex.push(createTask("t5", 300));
ex.push(createTask("t6", 600));
ex.push(createTask("t7", 200));

// Expected Flow (approximate):
// t1, t2, t3 start.
// t2 finishes (500ms) -> t4 starts.
// t4 finishes (500+400=900ms) -> t5 starts.
// t3 finishes (800ms) -> t6 starts.
// t1 finishes (1000ms) -> t7 starts.
