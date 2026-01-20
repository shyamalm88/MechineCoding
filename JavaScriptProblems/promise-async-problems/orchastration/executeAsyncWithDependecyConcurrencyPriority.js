class AsyncEngine {
  constructor(limit = 2) {
    this.limit = limit;
    this.running = 0;
    this.graph = new Map();
    this.indegree = new Map();
    this.taskMap = new Map();
    this.readyQueue = [];
  }

  addTasks(tasks) {
    // Initialize
    for (const task of tasks) {
      this.taskMap.set(task.id, task);
      this.graph.set(task.id, []);
      this.indegree.set(task.id, task.deps.length);
    }

    // Build dependency graph
    for (const task of tasks) {
      for (const dep of task.deps) {
        this.graph.get(dep).push(task.id);
      }
    }

    // Seed ready queue
    for (const [id, count] of this.indegree.entries()) {
      if (count === 0) {
        this.readyQueue.push(this.taskMap.get(id));
      }
    }

    this.sortReady();
    this.run();
  }

  sortReady() {
    this.readyQueue.sort((a, b) => b.priority - a.priority);
  }

  run() {
    while (this.running < this.limit && this.readyQueue.length > 0) {
      const task = this.readyQueue.shift();
      this.running++;

      task
        .run()
        .catch(() => {}) // error policy can vary
        .finally(() => {
          this.running--;

          // Unlock dependents
          for (const nextId of this.graph.get(task.id)) {
            this.indegree.set(nextId, this.indegree.get(nextId) - 1);

            if (this.indegree.get(nextId) === 0) {
              this.readyQueue.push(this.taskMap.get(nextId));
            }
          }

          this.sortReady();
          this.run();
        });
    }
  }
}

const engine = new AsyncEngine(2);

const makeTask = (id, delay) => async () => {
  console.log(`START ${id}`);
  await new Promise((res) => setTimeout(res, delay));
  console.log(`END ${id}`);
};

engine.addTasks([
  { id: "A", deps: [], priority: 1, run: makeTask("A", 200) },
  { id: "B", deps: ["A"], priority: 10, run: makeTask("B", 100) },
  { id: "C", deps: ["A"], priority: 5, run: makeTask("C", 150) },
  { id: "D", deps: ["B", "C"], priority: 20, run: makeTask("D", 50) },
  { id: "E", deps: [], priority: 2, run: makeTask("E", 300) },
]);
