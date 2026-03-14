async function executeWithConcurrency(graph, concurrencyLimit) {
  const inDegree = {};
  const adj = {};

  // Build graph
  for (const job in graph) {
    inDegree[job] = graph[job].prerequisites.length;

    for (const pre of graph[job].prerequisites) {
      if (!adj[pre]) adj[pre] = [];
      adj[pre].push(job);
    }
  }

  const readyQueue = [];

  // find initial tasks
  for (const job in inDegree) {
    if (inDegree[job] === 0) {
      readyQueue.push(job);
    }
  }

  let running = 0;

  return new Promise((resolve) => {
    function schedule() {
      while (running < concurrencyLimit && readyQueue.length > 0) {
        const job = readyQueue.shift();
        running++;

        graph[job].action(() => {
          running--;

          if (adj[job]) {
            for (const next of adj[job]) {
              inDegree[next]--;

              if (inDegree[next] === 0) {
                readyQueue.push(next);
              }
            }
          }

          if (running === 0 && readyQueue.length === 0) {
            resolve();
          } else {
            schedule();
          }
        });
      }
    }

    schedule();
  });
}

const tasks = {
  A: runJobA,
  B: runJobB,
  C: runJobC,
  D: runJobD,
  E: runJobE,
};

const dependencies = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["C", "E"],
];

async function executeWithConcurrency(graph, concurrencyLimit) {
  const inDegree = {};
  const adj = {};

  // Build graph
  for (const job in graph) {
    inDegree[job] = graph[job].prerequisites.length;

    for (const pre of graph[job].prerequisites) {
      if (!adj[pre]) adj[pre] = [];
      adj[pre].push(job);
    }
  }

  const readyQueue = [];

  // find initial tasks
  for (const job in inDegree) {
    if (inDegree[job] === 0) {
      readyQueue.push(job);
    }
  }

  let running = 0;

  return new Promise((resolve) => {
    function schedule() {
      while (running < concurrencyLimit && readyQueue.length > 0) {
        const job = readyQueue.shift();
        running++;

        graph[job].action(() => {
          running--;

          if (adj[job]) {
            for (const next of adj[job]) {
              inDegree[next]--;

              if (inDegree[next] === 0) {
                readyQueue.push(next);
              }
            }
          }

          if (running === 0 && readyQueue.length === 0) {
            resolve();
          } else {
            schedule();
          }
        });
      }
    }

    schedule();
  });
}

const taskGraph = {
  jobE: { prerequisites: ["jobC", "jobD"], action: runJobE },
  jobC: { prerequisites: [], action: runJobC },
  jobD: { prerequisites: ["jobA", "jobB"], action: runJobD },
  jobA: { prerequisites: [], action: runJobA },
  jobB: { prerequisites: [], action: runJobB },
};

executeWithConcurrency(taskGraph, 2);
