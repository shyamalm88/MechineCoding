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
  // Stores the promise representing the execution of each task
  // Key idea: each task runs ONCE, others wait on the same promise
  const executed = new Map();

  // Ensures a task is executed after its dependencies
  async function executeTask(taskName) {
    // STEP 1: If task already started, just wait for it
    if (executed.has(taskName)) {
      return executed.get(taskName);
    }

    // STEP 2: Validate task exists
    const task = tasks[taskName];
    if (!task) {
      throw new Error(`Task "${taskName}" not found`);
    }

    // STEP 3: Create the execution promise (but don’t await yet)
    const promise = (async () => {
      // STEP 4: Execute all dependencies first
      for (const dependency of task.deps) {
        await executeTask(dependency);
      }

      // STEP 5: Now execute the actual task
      await task.run();
    })();

    // STEP 6: Cache the promise immediately (handles diamond deps)
    executed.set(taskName, promise);

    // STEP 7: Return the promise so callers can await it
    return promise;
  }

  // STEP 8: Ensure every task eventually runs
  for (const taskName of Object.keys(tasks)) {
    await executeTask(taskName);
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
