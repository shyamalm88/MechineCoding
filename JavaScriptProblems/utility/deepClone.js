function deepClone(obj, cache = new WeakMap()) {
  // ==========================================
  // 1. Primitives & Functions
  // ==========================================
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // ==========================================
  // 2. Circular References
  // ==========================================
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  // ==========================================
  // 3. Built-in Types
  // ==========================================

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  if (obj instanceof Map) {
    const clone = new Map();
    cache.set(obj, clone);

    for (const [key, value] of obj) {
      clone.set(deepClone(key, cache), deepClone(value, cache));
    }

    return clone;
  }

  if (obj instanceof Set) {
    const clone = new Set();
    cache.set(obj, clone);

    for (const value of obj) {
      clone.add(deepClone(value, cache));
    }

    return clone;
  }

  // ==========================================
  // 4. Arrays / Objects / Class Instances
  // ==========================================

  const clone = Array.isArray(obj) ? [] : {};

  cache.set(obj, clone);

  // ==========================================
  // 5. Copy ALL own properties
  //    - string keys
  //    - symbol keys
  // ==========================================

  for (const key of Reflect.ownKeys(obj)) {
    clone[key] = deepClone(obj[key], cache);
  }

  return clone;
}
