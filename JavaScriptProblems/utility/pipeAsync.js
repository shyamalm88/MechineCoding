const asyncPipe =
  (...fns) =>
  (input) =>
    fns.reduce(
      (p, fn) => p.then(fn), // Step 3: Chain each fn with .then()
      Promise.resolve(input) // Step 4: Start with Promise-wrapped input
    );
