/**
 * Executes tasks respecting their dependencies.
 * Ensures each task runs exactly once, even with diamond dependencies.
 *
 * @param {Object} tasks - Object where keys are task IDs and values are task objects.
 *
 * INTUITION:
 * This is a dependency resolution problem. We can view it as a graph traversal.
 * To execute task T, we must first execute all its dependencies.
 *
 * Key Challenge: Diamond Dependencies.
 * If B depends on A, and C depends on A, and D depends on B & C.
 * When running D -> runs B -> runs A.
 * When running D -> runs C -> runs A.
 * A should only run ONCE.
 *
 * Solution: Memoization.
 * Store the *Promise* of each running task in a Map.
 * When a task is requested, if it's in the Map, return the existing promise.
 * This ensures the task function is called exactly once, and subsequent callers wait for the same result.
 *
 * DRY RUN:
 * Tasks: A, B(dep A), C(dep A).
 *
 * 1. Loop iterates A. Call runTask(A).
 *    - Map has A? No. Create Promise P_A (executes A). Map.set(A, P_A). Return P_A.
 * 2. Loop iterates B. Call runTask(B).
 *    - Map has B? No. Create Promise P_B.
 *      - Call runTask(A). Map has A? Yes (P_A). Return P_A.
 *      - await P_A. Execute B.
 *    - Map.set(B, P_B).
 * 3. Loop iterates C. Call runTask(C).
 *    - ... calls runTask(A) -> returns P_A.
 *    - ... Execute C.
 */
async function executeAsyncWithDependencies(tasks) {
  // Use a Map to store promises of running tasks to handle diamond dependencies
  // (e.g., B and C both depend on A; A should only run once).
  const taskPromises = new Map();
  const visiting = new Set();

  async function runTask(name) {
    if (taskPromises.has(name)) return taskPromises.get(name);

    const promise = (async () => {
      const task = tasks[name];
      if (!task) throw new Error(`Task ${name} not found`);

      for (const dep of task.deps) {
        await runTask(dep);
      }

      await task.run();
    })();

    taskPromises.set(name, promise);
    return promise;
  }

  for (const name in tasks) {
    await runTask(name);
  }
}

// --- Test Data ---

// Changed from Array to Object to match the function's access pattern (tasks[name])
const tasks = {
  A: {
    deps: [],
    run: async () => {
      console.log("A start");
      await new Promise((res) => setTimeout(res, 100));
      console.log("A end");
    },
  },
  B: {
    deps: ["A"],
    run: async () => {
      console.log("B start");
      await new Promise((res) => setTimeout(res, 50));
      console.log("B end");
    },
  },
  C: {
    deps: ["A"],
    run: async () => {
      console.log("C start");
      await new Promise((res) => setTimeout(res, 50));
      console.log("C end");
    },
  },
  D: {
    deps: ["B", "C"],
    run: async () => {
      console.log("D start");
      await new Promise((res) => setTimeout(res, 30));
      console.log("D end");
    },
  },
};

// Fixed function name typo (executeWithDependencies -> executeAsyncWithDependencies)
executeAsyncWithDependencies(tasks);
