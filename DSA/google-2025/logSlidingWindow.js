/**
 * ============================================================================
 * PROBLEM: Logger Rate Limiter / Sliding Window Counter
 * ============================================================================
 * Design a logger system that receives a stream of logs with timestamps and
 * levels. We need to query the number of "ERROR" logs that occurred in the
 * last K seconds.
 *
 * Constraints:
 * - Timestamps might arrive slightly out of order (handled by sorting).
 * - Efficient query.
 */

// ============================================================================
// APPROACH: Sorted Array + Map (Sliding Window)
// ============================================================================
/**
 * INTUITION:
 * We need to count events in range [currentTime - K, currentTime].
 * Since logs can arrive out of order, we maintain a sorted list of timestamps.
 *
 * - `addLog`: Insert timestamp into sorted array (Binary Search + Splice).
 *   Update count in a Map.
 * - `query`: Remove timestamps smaller than `currentTime - K` from the front
 *   (Sliding Window). Return total count.
 *
 * DRY RUN:
 * Window = 10s.
 * 1. Add (1, ERROR). TS: [1]. Map: {1:1}. Total: 1.
 * 2. Add (5, ERROR). TS: [1, 5]. Map: {1:1, 5:1}. Total: 2.
 * 3. Add (2, ERROR). TS: [1, 2, 5]. Map: {1:1, 2:1, 5:1}. Total: 3.
 * 4. Query(12). Expire < 2.
 *    - Remove 1. Total: 2.
 *    - 2 is not < 2. Stop.
 *    - Return 2.
 */
class LogSlidingWindow {
  constructor(windowSize) {
    this.windowSize = windowSize; // K seconds
    this.timeMap = new Map(); // timestamp -> count
    this.timestamps = []; // sorted timestamps
    this.total = 0;
  }

  /**
   * Binary insert timestamp to keep array sorted
   */
  insertTimestamp(ts) {
    let left = 0,
      right = this.timestamps.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (this.timestamps[mid] < ts) left = mid + 1;
      else right = mid;
    }
    this.timestamps.splice(left, 0, ts);
  }

  /**
   * Add a log entry
   */
  addLog(timestamp, level) {
    if (level !== "ERROR") return;

    if (!this.timeMap.has(timestamp)) {
      this.timeMap.set(timestamp, 0);
      this.insertTimestamp(timestamp);
    }

    this.timeMap.set(timestamp, this.timeMap.get(timestamp) + 1);
    this.total++;
  }

  /**
   * Query count of errors in last K seconds from `currentTime`
   */
  query(currentTime) {
    const expireTime = currentTime - this.windowSize;

    while (this.timestamps.length && this.timestamps[0] < expireTime) {
      const ts = this.timestamps.shift();
      this.total -= this.timeMap.get(ts);
      this.timeMap.delete(ts);
    }

    return this.total;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Log Sliding Window Tests ===\n");

const logger = new LogSlidingWindow(10); // 10 second window

logger.addLog(1, "ERROR");
logger.addLog(5, "ERROR");
logger.addLog(2, "ERROR"); // Out of order
logger.addLog(3, "INFO"); // Should be ignored

console.log("Count at t=12:", logger.query(12));
// Window [2, 12]. Timestamps 1 (expired), 2, 5.
// Expected: 2
