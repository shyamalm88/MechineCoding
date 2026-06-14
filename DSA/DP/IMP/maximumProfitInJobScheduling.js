/**
 * ============================================================================
 * PROBLEM: Maximum Profit in Job Scheduling (LeetCode #1235)
 * CATEGORY: 🟢 IMPORTANT (DP + Binary Search on Sorted Intervals)
 * ============================================================================
 * You are given n jobs, where job i starts at startTime[i], ends at
 * endTime[i], and pays profit[i].
 *
 * You can only work on ONE job at a time. A job CAN start the exact instant
 * another job ends (intervals are allowed to touch, not overlap).
 *
 * Return the maximum total profit you can earn.
 *
 * Example 1:
 * Input: startTime=[1,2,3,3], endTime=[3,4,5,6], profit=[50,10,40,70]
 * Output: 120
 * Explanation: job 1 (1-3, profit 50) + job 4 (3-6, profit 70) = 120
 *
 * Example 2:
 * Input: startTime=[1,2,3,4,6], endTime=[3,5,10,6,9], profit=[20,20,100,70,60]
 * Output: 150
 *
 * Example 3:
 * Input: startTime=[1,1,1], endTime=[2,3,4], profit=[5,6,4]
 * Output: 6
 *
 * Constraints:
 * - 1 <= startTime.length == endTime.length == profit.length <= 5*10^4
 * - 1 <= startTime[i] < endTime[i] <= 10^9
 * - 1 <= profit[i] <= 10^4
 */

// ============================================================================
// APPROACH: Sort by End Time + DP with Binary Search for Last Compatible Job
// ============================================================================
/**
 * STORY / INTUITION:
 * This is the "weighted interval scheduling" problem — a generalization of
 * House Robber to ARBITRARY intervals instead of a fixed array of adjacent
 * slots. For each job, you face the same binary choice: SKIP it, or TAKE it
 * (and then jump to whatever profit was achievable using only jobs that
 * finished by the time this one starts).
 *
 * Sort jobs by END TIME. Define dp[i] = max profit using only the first i
 * jobs (in sorted order). For the i-th job (1-indexed):
 *   dp[i] = max( dp[i-1],                          // skip this job
 *                profit[i] + dp[k] )                // take it
 * where `k` is the count of jobs (in dp's 1-indexed sense) that all END at
 * or before this job's START time — found via BINARY SEARCH on the sorted
 * end times, since "dp[k]" is monotonically non-decreasing.
 *
 * Sorting by end time is what makes "dp[k]" well-defined and searchable:
 * any job with index <= k in the sorted order is guaranteed to end before
 * the current job starts.
 *
 * DRY RUN: startTime=[1,2,3,3], endTime=[3,4,5,6], profit=[50,10,40,70]
 * jobs sorted by end: [1,3,50] [2,4,10] [3,5,40] [3,6,70]
 * dp[0]=0
 * i=1 (1,3,50): no prior job ends <= 1 -> k=0. dp[1]=max(0, 50+0)=50
 * i=2 (2,4,10): no prior job ends <= 2 -> k=0. dp[2]=max(50, 10+0)=50
 * i=3 (3,5,40): job[0] ends at 3 <= 3 -> k=1. dp[3]=max(50, 40+dp[1]=90)=90
 * i=4 (3,6,70): job[0] ends at 3 <= 3 -> k=1. dp[4]=max(90, 70+dp[1]=120)=120
 * Result: dp[4]=120 ✓
 *
 * Time:  O(N log N) — sort + binary search per job
 * Space: O(N) — jobs array + dp array
 */
const jobScheduling = (startTime, endTime, profit) => {
  const n = startTime.length;
  const jobs = startTime
    .map((s, i) => [s, endTime[i], profit[i]])
    .sort((a, b) => a[1] - b[1]); // sort by end time

  const dp = new Array(n + 1).fill(0);

  // Binary search: among jobs[0..count-1], find the largest dp-index `k`
  // (1-indexed) such that jobs[k-1].end <= target. Returns 0 if none.
  const lastCompatible = (count, target) => {
    let lo = 0, hi = count - 1, result = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (jobs[mid][1] <= target) {
        result = mid + 1;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return result;
  };

  for (let i = 1; i <= n; i++) {
    const [start, , prof] = jobs[i - 1];
    const k = lastCompatible(i - 1, start);
    dp[i] = Math.max(dp[i - 1], prof + dp[k]);
  }

  return dp[n];
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Maximum Profit in Job Scheduling Tests ===\n");

console.log(
  "Test 1:",
  jobScheduling([1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70])
); // Expected: 120

console.log(
  "Test 2:",
  jobScheduling([1, 2, 3, 4, 6], [3, 5, 10, 6, 9], [20, 20, 100, 70, 60])
); // Expected: 150

console.log("Test 3:", jobScheduling([1, 1, 1], [2, 3, 4], [5, 6, 4])); // Expected: 6

module.exports = { jobScheduling };
