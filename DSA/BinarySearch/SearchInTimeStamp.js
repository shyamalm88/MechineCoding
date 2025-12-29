/**
 * ============================================================================
 * PROBLEM: Time Based Key-Value Store (LeetCode #981)
 * ============================================================================
 * Design a time-based key-value data structure that can store multiple values
 * for the same key at different time stamps and retrieve the key's value at a
 * certain timestamp.
 *
 * Implement the TimeMap class:
 * - TimeMap() Initializes the object of the data structure.
 * - void set(String key, String value, int timestamp) Stores the key key with
 *   the value value at the given time timestamp.
 * - String get(String key, int timestamp) Returns a value such that set was
 *   called previously, with timestamp_prev <= timestamp. If there are multiple
 *   such values, it returns the value associated with the largest timestamp_prev.
 *   If there are no values, it returns "".
 *
 * Example 1:
 * Input
 * ["TimeMap", "set", "get", "get", "set", "get", "get"]
 * [[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
 * Output
 * [null, null, "bar", "bar", null, "bar2", "bar2"]
 *
 * Constraints:
 * - 1 <= key.length, value.length <= 100
 * - 1 <= timestamp <= 10^7
 * - All the timestamps timestamp of set are strictly increasing.
 */

// ============================================================================
// APPROACH: HashMap + Binary Search
// ============================================================================
/**
 * INTUITION:
 * We need to store values associated with a key and a timestamp.
 * A HashMap is natural for Key -> Data lookup.
 * Since `set` is called with strictly increasing timestamps, the list of
 * [timestamp, value] pairs for any key will be naturally sorted by time.
 *
 * For `get(key, timestamp)`, we need the value with the largest time <= timestamp.
 * Since the list is sorted, we can use Binary Search to find this position efficiently.
 *
 * Time Complexity: Set O(1), Get O(log N)
 * Space Complexity: O(N) total entries stored.
 */
class TimeMap {
  constructor() {
    // 📦 The Storage: Map<Key, Array<[time, value]>>
    this.store = new Map();
  }

  /** * @param {string} key
   * @param {string} value
   * @param {number} timestamp
   * @return {void}
   */
  set(key, value, timestamp) {
    if (!this.store.has(key)) {
      this.store.set(key, []);
    }
    // 🚀 Push to history.
    // Since timestamps are increasing, this array is ALWAYS sorted.
    this.store.get(key).push([timestamp, value]);
  }

  /** * @param {string} key
   * @param {number} timestamp
   * @return {string}
   */
  get(key, timestamp) {
    const history = this.store.get(key);
    if (!history) return "";

    // 🔍 Binary Search for the value
    // Condition: Find valid value where time <= timestamp
    let left = 0;
    let right = history.length - 1;
    let res = "";

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const [time, val] = history[mid];

      if (time === timestamp) {
        return val; // Exact match found!
      }

      if (time < timestamp) {
        // Potential answer (it is older than target).
        // Store it, but try to move Right to find a "fresher" value.
        res = val;
        left = mid + 1;
      } else {
        // This time is in the future. Too new. Look Left.
        right = mid - 1;
      }
    }

    return res;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Time Based Key-Value Store Tests ===\n");

const timeMap = new TimeMap();

timeMap.set("foo", "bar", 1);
console.log("Test 1 (Exact time):", timeMap.get("foo", 1)); // Expected: "bar"

console.log("Test 2 (Future time):", timeMap.get("foo", 3)); // Expected: "bar"

timeMap.set("foo", "bar2", 4);
console.log("Test 3 (Updated time):", timeMap.get("foo", 4)); // Expected: "bar2"
console.log("Test 4 (Later time):", timeMap.get("foo", 5)); // Expected: "bar2"
console.log("Test 5 (Missing key):", timeMap.get("baz", 5)); // Expected: ""
