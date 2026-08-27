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

module.exports = { TimeMap };
