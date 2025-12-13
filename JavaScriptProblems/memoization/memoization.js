const memoization = (fn) => {
  // The cache will store results against a serialized key.
  const cache = new Map();

  // The returned function accepts any number of arguments using rest parameters.
  return function (...args) {
    // 1. Create a stable, primitive key from the arguments.
    // JSON.stringify is a common and simple way to do this.
    const key = JSON.stringify(args);

    // 2. Check if the result is already in the cache.
    if (cache.has(key)) {
      return cache.get(key);
    }

    // 3. If not, compute the result.
    // Use .apply() to pass the arguments array to the original function
    // and preserve the `this` context.
    const result = fn.apply(this, args);

    // 4. Store the new result in the cache.
    cache.set(key, result);

    // 5. Return the result.
    return result;
  };
};
