/**
 * ============================================================================
 * PROBLEM: Time Based Key-Value Store (LeetCode #981)
 * ============================================================================
 * Design a time-based key-value data structure that can store multiple values
 * for the same key at different time stamps and retrieve the key's value at a
 * certain timestamp.
 *
 * Implement the TimeMap class:
 * - set(key, value, timestamp): Stores the key and value at the given timestamp.
 * - get(key, timestamp): Returns a value such that set was called previously,
 *   with timestamp_prev <= timestamp. If there are multiple such values, it
 *   returns the value associated with the largest timestamp_prev.
 */

// ============================================================================
// APPROACH: Hash Map + Binary Search
// ============================================================================
/**
 * INTUITION:
 * We need to store a history of values for each key.
 * A Map<Key, Array<{timestamp, value}>> is suitable.
 *
 * Since timestamps in `set` are strictly increasing (usually implied or enforced),
 * the array for each key is naturally sorted by timestamp.
 *
 * For `get(key, timestamp)`, we need to find the element with the largest
 * timestamp <= requested timestamp. This is a classic Binary Search (upper bound)
 * problem on the sorted array.
 *
 * DRY RUN:
 * set("foo", "bar", 1) -> store["foo"] = [{1, "bar"}]
 * set("foo", "bar2", 4) -> store["foo"] = [{1, "bar"}, {4, "bar2"}]
 * get("foo", 3): Binary search for <= 3. Found {1, "bar"}. Return "bar".
 */
class VersionedKV {
  constructor() {
    this.store = new Map();
  }

  /**
   * Store a value at a given timestamp
   */
  put(key, value, timestamp) {
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }
    this.store.get(key).push({ timestamp, value });
  }

  /**
   * Get the value visible at timestamp T
   */
  get(key, timestamp) {
    if (!this.store.has(key)) return null;

    const versions = this.store.get(key);

    // Binary search for latest timestamp <= T
    let left = 0;
    let right = versions.length - 1;
    let result = null;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (versions[mid].timestamp <= timestamp) {
        result = versions[mid].value;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    return result;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Snapshot Versioning Tests ===\n");

const kv = new VersionedKV();
kv.put("foo", "bar", 1);
kv.put("foo", "bar2", 4);

console.log("Get foo @ 1:", kv.get("foo", 1)); // bar
console.log("Get foo @ 3:", kv.get("foo", 3)); // bar
console.log("Get foo @ 4:", kv.get("foo", 4)); // bar2
console.log("Get foo @ 5:", kv.get("foo", 5)); // bar2
console.log("Get foo @ 0:", kv.get("foo", 0)); // null
