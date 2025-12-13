const memoization = (fn) => {
  let weakCache = new WeakMap();
  let strongCache = new Map();
  return function (args) {
    const isObj =
      args && (typeof args === "object" || typeof args === "function");
    const cache = isObj ? weakCache : strongCache;

    if (cache.has(args)) {
      return cache.get(args);
    }

    const result = fn.call(this, args);
    cache.set(args, result);
    return result;
  };
};
