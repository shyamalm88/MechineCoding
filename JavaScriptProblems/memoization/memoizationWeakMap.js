const memoization = (fn) => {
  let objectCache = new WeakMap();
  let primitiveCache = new Map();
  return function (args) {
    const isObj =
      args && (typeof args === "object" || typeof args === "function");
    const cache = isObj ? objectCache : primitiveCache;

    if (cache.has(args)) {
      return cache.get(args);
    }

    const result = fn.call(this, args);
    cache.set(args, result);
    return result;
  };
};
