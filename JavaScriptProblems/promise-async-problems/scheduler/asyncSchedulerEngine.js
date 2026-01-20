/**
 * ============================================================================
 * PROBLEM: Async Scheduler (Concurrency Limiter)
 * ============================================================================
 * Implement a scheduler that limits the number of concurrent async tasks.
 *
 * Requirements:
 * 1. `add(task)`: Adds a task (function returning a promise) to the scheduler.
 * 2. `limit`: Maximum number of tasks running at the same time.
 * 3. When a task finishes, the next task in the queue should start immediately.
 *
 * ============================================================================
 * INTUITION: Queue + Counter
 * ============================================================================
 * 1. Maintain a `queue` of pending tasks.
 * 2. Maintain a `running` counter for currently active tasks.
 * 3. When `add()` is called, push to queue and try to `run()`.
 * 4. In `run()`:
 *    - While `running < limit` and `queue` is not empty:
 *      - Dequeue a task.
 *      - Increment `running`.
 *      - Execute task.
 *      - Attach `.finally()` to the promise.
 * 5. In `.finally()`:
 *    - Decrement `running`.
 *    - Call `run()` again to pick up the next task.
 *
 * Time Complexity: O(1) for add (amortized), O(1) for scheduling next.
 * Space Complexity: O(N) where N is the number of pending tasks.
 */
class AsyncScheduler {
  constructor(limit = 2) {
    this.queue = [];
    this.running = 0;
    this.limit = limit;
  }

  add(task) {
    this.queue.push(task);
    this.run();
  }

  run() {
    while (this.running < this.limit && this.queue.length > 0) {
      const task = this.queue.shift();
      this.running++;

      task()
        .catch(() => {
          // swallow error or log — depends on requirements
        })
        .finally(() => {
          this.running--;
          this.run(); // schedule next
        });
    }
  }
}

const scheduler = new AsyncScheduler(2);

const createTask = (name, delay) => () =>
  new Promise((res) => {
    console.log(`START ${name}`);
    setTimeout(() => {
      console.log(`END ${name}`);
      res();
    }, delay);
  });

// 1. A and B start immediately (Limit 2).
scheduler.add(createTask("A", 300));
scheduler.add(createTask("B", 100));

// 2. C and D are queued.
scheduler.add(createTask("C", 200));
scheduler.add(createTask("D", 50));

// Expected Output:
// START A
// START B
// END B   (100ms) -> Slot opens -> C starts
// START C
// END C   (100ms + 200ms = 300ms) -> Slot opens -> D starts
// START D
// END A   (300ms) -> Slot opens
// END D   (300ms + 50ms = 350ms)
