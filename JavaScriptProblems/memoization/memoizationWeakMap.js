const memoization = (fn) => {
  // Use WeakMap for objects to prevent memory leaks (garbage collection).
  // Use Map for primitive values (strings, numbers, booleans, etc.).
  let objectCache = new WeakMap();
  let primitiveCache = new Map();

  return function (args) {
    // Determine if the input argument is an object or function (reference type).
    // Note: typeof null is 'object', but null is a primitive for caching purposes here.
    const isObj =
      args && (typeof args === "object" || typeof args === "function");

    // Select the appropriate cache based on the argument type.
    const cache = isObj ? objectCache : primitiveCache;

    // Check if the result exists in the cache.
    if (cache.has(args)) {
      return cache.get(args);
    }

    // Execute the original function with the argument.
    // .call(this) ensures the context is preserved.
    const result = fn.call(this, args);

    // Store the result in the cache for future use.
    cache.set(args, result);
    return result;
  };
};
