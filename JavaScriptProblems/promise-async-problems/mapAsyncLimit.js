const mapAsyncLimit = (inputs, limit, iterateFn) => {
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

  let workers = [];
  let activeWorker = Math.min(limit, n);
  for (let i = 0; i < activeWorker; i++) {
    workers.push(worker());
  }

  return Promise.all(workers).then(() => results);
};
