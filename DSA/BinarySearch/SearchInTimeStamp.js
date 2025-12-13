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
