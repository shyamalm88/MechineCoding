function memoizeAsync(fn) {
  // 1. Two separate caches
  const primitiveCache = new Map();
  const objectCache = new WeakMap();

  return function (arg) {
    // 2. Decide which cache to use based on type
    const isObject =
      (typeof arg === "object" && arg !== null) || typeof arg === "function";
    const cache = isObject ? objectCache : primitiveCache;

    // 3. Check Cache
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    // 4. Execute Function
    // We use .call(this) to preserve context
    const promise = fn.call(this, arg).catch((err) => {
      // 5. Delete on error (works for both Map and WeakMap)
      cache.delete(arg);
      throw err;
    });

    // 6. Store in the correct cache
    cache.set(arg, promise);

    return promise;
  };
}
