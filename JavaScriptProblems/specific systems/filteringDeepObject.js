// Filtering Deep Objects
// filterDeep(obj, predicate) — recursively keep only key-value pairs where predicate(key, value) returns true.
// Prunes resulting empty objects/arrays so the output is always clean.

function filterDeep(obj, predicate) {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => filterDeep(item, predicate))
      .filter((item) => item != null);
  }

  if (obj && typeof obj === "object") {
    const result = {};

    for (const [key, value] of Object.entries(obj)) {
      if (!predicate(key, value)) continue;

      if (typeof value === "object" && value !== null) {
        const filtered = filterDeep(value, predicate);
        if (filtered !== null) result[key] = filtered;
      } else {
        result[key] = value;
      }
    }

    return Object.keys(result).length ? result : null;
  }

  return obj;
}

// --- Common usage patterns (thin wrappers to show intent) ---

const filterByKeys = (obj, keysToRemove) => {
  const drop = new Set(keysToRemove);
  return filterDeep(obj, (k) => !drop.has(k));
};

const keepOnlyKeys = (obj, keysToKeep) => {
  const keep = new Set(keysToKeep);
  // must return true for objects so we can traverse into them
  return filterDeep(
    obj,
    (k, v) => (v !== null && typeof v === "object") || keep.has(k),
  );
};

const filterNullish = (obj) => filterDeep(obj, (k, v) => v != null);

const filterFalsy = (obj) =>
  filterDeep(
    obj,
    (k, v) => (v !== null && typeof v === "object") || Boolean(v),
  );

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

console.log("\n6. Remove string values:");
console.log(
  JSON.stringify(
    filterDeep(user, (k, v) => typeof v !== "string"),
    null,
    2,
  ),
);
