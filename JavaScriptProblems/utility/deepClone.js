function deepClone(obj) {
  // 1. Base Case: Primitives or Null
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 2. Handle Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 3. Create generic container (Array or Object)
  const clone = Array.isArray(obj) ? [] : {};

  // 4. Recursively copy keys
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }

  return clone;
}
