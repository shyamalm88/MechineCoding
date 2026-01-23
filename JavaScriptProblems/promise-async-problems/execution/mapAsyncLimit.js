const mapAsyncLimit = async (inputs, limit, iterateFn) => {
  let n = inputs.length;
  let nextIndex = 0;
  let results = new Array(n);

  const worker = async () => {
    while (nextIndex < n) {
      let currentIndex = nextIndex;
      nextIndex++;

      try {
        results[currentIndex] = await iterateFn(inputs[currentIndex]);
      } catch (err) {
        results[currentIndex] = { status: "failed", reason: err };
      }
    }
  };

  // Create a pool of workers up to the concurrency limit
  let workers = [];
  let activeWorker = Math.min(limit, n);
  for (let i = 0; i < activeWorker; i++) {
    workers.push(worker());
  }

  // Wait for all workers to finish and return the results array
  await Promise.all(workers);
  return results;
};

// ============================================================================
// TEST DATA & USAGE EXAMPLE
// ============================================================================

const asyncTask = (id) => {
  return new Promise((resolve, reject) => {
    // Simulate variable duration.
    // Task 2 is fast (100ms), others are slower (300ms).
    const time = id === 2 ? 100 : 300;
    setTimeout(() => {
      if (id === 3) {
        reject(`Error on item ${id}`);
      } else {
        console.log(`Task ${id} done`);
        resolve(id * 10);
      }
    }, time);
  });
};

const items = [1, 2, 3, 4, 5];

console.log("--- Starting Execution (Limit: 2) ---");
mapAsyncLimit(items, 2, asyncTask).then((results) => {
  console.log("\n--- Final Results (Order Preserved) ---");
  console.log(results);
});
