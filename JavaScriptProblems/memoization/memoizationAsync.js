function memoizeAsync(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    // 1. Create the promise
    const promise = fn.apply(this, args).catch((err) => {
      // 2. IMPORTANT: Delete from cache on error so we can retry later
      cache.delete(key);
      throw err;
    });

    // 3. Store the PROMISE, not the value
    cache.set(key, promise);

    return promise;
  };
}
