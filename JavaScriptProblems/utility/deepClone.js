/**
 * ============================================================================
 * PROBLEM: Deep Clone
 * ============================================================================
 * Create a function that creates a deep copy of a value.
 * It should handle:
 * 1. Primitives (return as is).
 * 2. Arrays and Objects (recursively copy).
 * 3. Circular references (use a Map/WeakMap to track visited objects).
 * 4. Special types like Date (optional but good to have).
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * - Recursion is the natural fit for traversing a tree-like structure.
 * - We need to handle the "graph" nature of objects (cycles) using a cache.
 * - WeakMap is ideal for the cache because it holds weak references to keys,
 *   allowing garbage collection if the original object is no longer used.
 */
function deepClone(obj, map = new WeakMap()) {
  // 1. Base Case: Primitives or Null
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 2. Handle Circular References
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 3. Handle Special Types (Date)
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 4. Create generic container (Array or Object)
  const clone = Array.isArray(obj) ? [] : {};

  // 5. Register in Cache (Critical for circular refs)
  map.set(obj, clone);

  // 6. Recursively copy keys
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }

  return clone;
}
