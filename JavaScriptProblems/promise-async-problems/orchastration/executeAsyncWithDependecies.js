/**
 * Executes tasks respecting their dependencies.
 * Ensures each task runs exactly once, even with diamond dependencies.
 *
 * @param {Object} tasks - Object where keys are task IDs and values are task objects.
 */
async function executeAsyncWithDependencies(tasks) {
  // Use a Map to store promises of running tasks to handle diamond dependencies
  // (e.g., B and C both depend on A; A should only run once).
  const taskPromises = new Map();

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
