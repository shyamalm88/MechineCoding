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
