// ---- memoization.js: Map + JSON.stringify key (any number of args) ----
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

// ---- memoizationWeakMap.js: single argument, WeakMap for objects (no leak) ----
const memoizationWeakMap = (fn) => {
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

export { memoization, memoizationWeakMap }
