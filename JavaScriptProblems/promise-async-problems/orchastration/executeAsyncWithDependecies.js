async function executeWithDependencies(tasks) {
  const graph = new Map();
  const indegree = new Map();

  // Initialize
  for (const { id, deps } of tasks) {
    graph.set(id, []);
    indegree.set(id, deps.length);
  }

  // Build graph
  for (const { id, deps } of tasks) {
    for (const dep of deps) {
      graph.get(dep).push(id);
    }
  }

  // Queue of tasks ready to run
  const queue = [];
  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  for (const [id, count] of indegree.entries()) {
    if (count === 0) queue.push(id);
  }

  // Process tasks
  while (queue.length > 0) {
    const id = queue.shift();
    const task = taskMap.get(id);

    await task.run(); // important: await execution

    for (const next of graph.get(id)) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) {
        queue.push(next);
      }
    }
  }
}

const tasks = [
  {
    id: "A",
    deps: [],
    run: async () => {
      console.log("A start");
      await new Promise((res) => setTimeout(res, 100));
      console.log("A end");
    },
  },
  {
    id: "B",
    deps: ["A"],
    run: async () => {
      console.log("B start");
      await new Promise((res) => setTimeout(res, 50));
      console.log("B end");
    },
  },
  {
    id: "C",
    deps: ["A"],
    run: async () => {
      console.log("C start");
      await new Promise((res) => setTimeout(res, 50));
      console.log("C end");
    },
  },
  {
    id: "D",
    deps: ["B", "C"],
    run: async () => {
      console.log("D start");
      await new Promise((res) => setTimeout(res, 30));
      console.log("D end");
    },
  },
];

executeWithDependencies(tasks);
