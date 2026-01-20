const mapAsyncLimit = (inputs, limit, iterateFn) => {
  // Total number of items to process
  let n = inputs.length;
  // Shared index tracker to ensure workers pick up unique tasks
  let nextIndex = 0;
  // Array to store results in the same order as inputs
  let results = new Array(n);

  // Worker function that processes items as long as there are items left
  const worker = async () => {
    while (nextIndex < n) {
      // Atomically capture the current index and increment for the next worker
      let currentIndex = nextIndex;
      nextIndex++;

      try {
        // Process the item and await the result
        results[currentIndex] = await iterateFn(inputs[currentIndex]);
      } catch (err) {
        // Handle errors gracefully without stopping other workers
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
  return Promise.all(workers).then(() => results);
};
