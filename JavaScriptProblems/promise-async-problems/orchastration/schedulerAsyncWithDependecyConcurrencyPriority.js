/**
 * Scheduler that executes tasks with dependencies, concurrency limits, and priority.
 *
 * Features:
 * - Dependencies: Tasks wait for their dependencies to complete.
 * - Concurrency: Only a limited number of tasks run simultaneously.
 * - Priority: Ready tasks are started based on priority (higher value = higher priority).
 *
 * INTUITION:
 * This problem combines three constraints:
 * 1. Dependencies: A task cannot start until its dependencies are in `completed` set.
 * 2. Concurrency: We cannot have more than `limit` tasks running at once.
 * 3. Priority: Among ready tasks, pick the one with highest priority.
 *
 * Approach:
 * - Maintain a `running` counter and `completed` set.
 * - In a loop (or triggered by events), filter tasks that are:
 *   a) Not completed
 *   b) Not currently running
 *   c) Have all dependencies met
 * - Sort these "ready" tasks by priority.
 * - Launch as many as possible up to `limit`.
 * - When a task finishes, add to `completed`, decrement `running`, and trigger the check again.
 *
 * DRY RUN:
 * Tasks: A (pri 1), B (dep A, pri 10), C (dep A, pri 1). Limit: 2.
 *
 * 1. Start run(). Pending: [A, B, C].
 * 2. Filter Ready: A (OK), B (Wait A), C (Wait A). Ready: [A].
 * 3. Loop: running(0) < limit(2). Shift A. Execute A.
 * 4. A finishes. completed.add(A). Call run().
 * 5. Filter Ready: B (OK), C (OK). Ready: [B, C].
 * 6. Sort Ready: B(10) > C(1) -> [B, C].
 * 7. Loop: running(0) < limit(2).
 *    - Shift B. Execute B.
 *    - Shift C. Execute C.
 * 8. running(2) == limit(2). Stop launching.
 */
class Scheduler {
  constructor(tasks, limit) {
    this.tasks = tasks;
    this.limit = limit;
    this.running = 0;
    this.completed = new Set();
    this.processing = new Set(); // Track tasks currently being executed to prevent duplicates
  }

  /**
   * Checks if a task's dependencies are all met.
   */
  canRun(name) {
    return this.tasks[name].deps.every((d) => this.completed.has(d));
  }

  /**
   * Main execution loop.
   * Polls for ready tasks and executes them within concurrency limits.
   */
  async run() {
    const pending = Object.keys(this.tasks);

    while (this.completed.size < pending.length) {
      const ready = pending
        .filter((n) => !this.completed.has(n) && !this.processing.has(n))
        .filter((n) => this.canRun(n))
        .sort((a, b) => this.tasks[b].priority - this.tasks[a].priority);

      while (this.running < this.limit && ready.length) {
        const name = ready.shift();
        this.running++;
        this.processing.add(name);

        (async () => {
          console.log(
            `Starting ${name} (Priority: ${this.tasks[name].priority})`,
          );
          await this.tasks[name].run();
          console.log(`Finished ${name}`);

          this.completed.add(name);
          this.processing.delete(name);
          this.running--;
          // Trigger a check immediately after a task finishes to minimize idle time
          this.run();
        })();
      }

      // Yield to event loop to prevent blocking; simple polling mechanism
      await new Promise((r) => setTimeout(r, 0));
    }
  }
}

// --- Test Data ---

const tasks = {
  A: {
    deps: [],
    priority: 1,
    run: async () => new Promise((r) => setTimeout(r, 300)),
  },
  B: {
    deps: ["A"],
    priority: 10, // High priority, should run before C once A is done
    run: async () => new Promise((r) => setTimeout(r, 100)),
  },
  C: {
    deps: ["A"],
    priority: 1,
    run: async () => new Promise((r) => setTimeout(r, 100)),
  },
  D: {
    deps: ["B", "C"],
    priority: 5,
    run: async () => new Promise((r) => setTimeout(r, 100)),
  },
};

const scheduler = new Scheduler(tasks, 2); // Concurrency limit of 2
console.log("Starting Scheduler...");
scheduler.run().then(() => console.log("All tasks completed."));
