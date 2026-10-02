function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Map) {
    const clonedMap = new Map();
    seen.set(value, clonedMap);

    for (const [key, val] of value) {
      clonedMap.set(deepClone(key, seen), deepClone(val, seen));
    }

    return clonedMap;
  }

  if (value instanceof Set) {
    const clonedSet = new Set();
    seen.set(value, clonedSet);

    for (const item of value) {
      clonedSet.add(deepClone(item, seen));
    }

    return clonedSet;
  }

  const cloned = Array.isArray(value) ? [] : {};

  seen.set(value, cloned);

  for (const key of Object.keys(value)) {
    cloned[key] = deepClone(value[key], seen);
  }

  return cloned;
}
