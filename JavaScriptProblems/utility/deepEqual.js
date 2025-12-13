function deepEqual(a, b) {
  // 1. Same reference or primitive equality
  if (a === b) return true;

  // 2. Null or Non-object check (and ensure they are not matching primitives)
  if (
    a === null ||
    typeof a !== "object" ||
    b === null ||
    typeof b !== "object"
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  // 3. Different number of keys? Fail.
  if (keysA.length !== keysB.length) return false;

  // 4. Check each key recursively
  for (let key of keysA) {
    // Check if key exists AND values match
    if (!b.hasOwnProperty(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}
