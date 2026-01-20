function composeAsync(...fns) {
  return async function (initialValue) {
    let result = initialValue;

    for (const fn of fns) {
      result = await fn(result);
    }

    return result;
  };
}

/**
 * Alternative Approach
 */

function composeAsync(...fns) {
  return function (initialValue) {
    return fns.reduce(
      (promise, fn) => promise.then(fn),
      Promise.resolve(initialValue),
    );
  };
}

const pipeline = composeAsync(
  (x) => x + 1, // sync
  async (x) => x * 2, // async
  (x) => Promise.resolve(x + 10), // promise-returning
);

pipeline(5).then(console.log);
// Output: 22
