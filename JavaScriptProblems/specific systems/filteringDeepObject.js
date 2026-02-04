// Filtering Deep Objects

/**
 * Filters a deeply nested object based on a predicate function.
 * Recursively traverses and filters nested objects/arrays.
 *
 * @param {Object} obj - The object to filter
 * @param {Function} predicate - (key, value) => boolean - return true to keep
 * @returns {Object} - Filtered object
 */
function filterDeep(obj, predicate) {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => filterDeep(item, predicate))
      .filter((item) => item !== undefined && item !== null);
  }

  if (typeof obj === "object" && obj !== null) {
    const result = {};

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const value = obj[key];

      // Check if this key-value should be kept
      if (!predicate(key, value)) continue;

      // Recursively filter nested objects/arrays
      if (typeof value === "object" && value !== null) {
        const filtered = filterDeep(value, predicate);
        // Only include if not empty
        if (
          Array.isArray(filtered) ? filtered.length > 0 :
          Object.keys(filtered).length > 0
        ) {
          result[key] = filtered;
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  return obj;
}

/**
 * Filter by key names - removes specified keys at any depth
 */
function filterByKeys(obj, keysToRemove) {
  const keysSet = new Set(keysToRemove);
  return filterDeep(obj, (key) => !keysSet.has(key));
}

/**
 * Keep only specified keys at any depth
 */
function keepOnlyKeys(obj, keysToKeep) {
  const keysSet = new Set(keysToKeep);
  return filterDeep(obj, (key, value) => {
    // Always traverse into objects/arrays
    if (typeof value === "object" && value !== null) return true;
    return keysSet.has(key);
  });
}

/**
 * Filter by value type - removes values of certain types
 */
function filterByType(obj, typesToRemove) {
  return filterDeep(obj, (key, value) => {
    if (typesToRemove.includes("null") && value === null) return false;
    if (typesToRemove.includes("undefined") && value === undefined) return false;
    if (typesToRemove.includes("empty") && value === "") return false;
    return !typesToRemove.includes(typeof value);
  });
}

/**
 * Filter out null/undefined values at any depth
 */
function filterNullish(obj) {
  return filterDeep(obj, (key, value) => value != null);
}

/**
 * Filter out falsy values at any depth
 */
function filterFalsy(obj) {
  return filterDeep(obj, (key, value) => {
    // Keep objects/arrays to traverse them
    if (typeof value === "object" && value !== null) return true;
    return Boolean(value);
  });
}

// ========== TESTS ==========

const user = {
  name: "John",
  age: 30,
  password: "secret123",
  address: {
    city: "NYC",
    zip: null,
    country: {
      name: "USA",
      code: "US",
      password: "hidden",
    },
  },
  friends: [
    { name: "Jane", password: "pass1", age: 25 },
    { name: "Bob", password: "pass2", age: 0 },
  ],
  metadata: {
    createdAt: "",
    updatedAt: null,
    isActive: false,
  },
};

console.log("Original:");
console.log(JSON.stringify(user, null, 2));

console.log("\n1. Filter out 'password' keys:");
console.log(JSON.stringify(filterByKeys(user, ["password"]), null, 2));

console.log("\n2. Keep only 'name' and 'city' keys:");
console.log(JSON.stringify(keepOnlyKeys(user, ["name", "city"]), null, 2));

console.log("\n3. Filter out null values:");
console.log(JSON.stringify(filterNullish(user), null, 2));

console.log("\n4. Filter out falsy values:");
console.log(JSON.stringify(filterFalsy(user), null, 2));

console.log("\n5. Custom predicate - remove keys starting with 'is':");
const filtered = filterDeep(user, (key) => !key.startsWith("is"));
console.log(JSON.stringify(filtered, null, 2));

console.log("\n6. Filter by type - remove strings:");
console.log(JSON.stringify(filterByType(user, ["string"]), null, 2));
