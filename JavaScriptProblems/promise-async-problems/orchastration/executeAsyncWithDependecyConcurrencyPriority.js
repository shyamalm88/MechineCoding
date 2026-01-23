/**
 * Scheduler that executes tasks with dependencies, concurrency limits, and priority.
 *
 * Features:
 * - Dependencies: Tasks wait for their dependencies to complete.
 * - Concurrency: Only a limited number of tasks run simultaneously.
 * - Priority: Ready tasks are started based on priority (higher value = higher priority).
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
