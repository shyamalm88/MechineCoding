/**
 * ============================================================================
 * PROBLEM: Maximum Profit in Job Scheduling (LeetCode #1235)
 * ============================================================================
 * We have n jobs, where every job is scheduled to be done from startTime[i]
 * to endTime[i], obtaining a profit of profit[i].
 *
 * You're given the startTime, endTime and profit arrays, return the maximum
 * profit you can take such that there are no two jobs in the subset with
 * overlapping time range.
 */

// ============================================================================
// APPROACH: Dynamic Programming + Binary Search
// ============================================================================
/**
 * INTUITION:
 * 1. Sort jobs by End Time. This allows us to process jobs in chronological order
 *    of completion.
 * 2. Define DP state: `dp[i]` = Max profit using a subset of the first `i` jobs.
 * 3. Transitions: For job `i`, we have two choices:
 *    a) Exclude job `i`: Profit is `dp[i-1]`.
 *    b) Include job `i`: Profit is `job[i].profit + dp[k]`, where `k` is the
 *       index of the last job that finishes before `job[i]` starts.
 *
 * We use Binary Search to efficiently find the index `k`.
 *
 * DRY RUN:
 * Jobs: [(1,3,50), (2,4,10), (3,5,40), (3,6,70)] (Sorted by end time)
 *
 * 1. i=0 (1,3,50).
 *    - Take: 50 + dp-1 = 50.
 *    - Skip: 0.
 *    - dp[0] = 50.
 *
 * 2. i=1 (2,4,10).
 *    - Take: 10 + find job ending <= 2. None. 10.
 *    - Skip: dp[0] = 50.
 *    - dp[1] = 50.
 *
 * ... and so on.
 */
function jobScheduling(startTime, endTime, profit) {
  const n = startTime.length;

  // Build jobs array
  const jobs = [];
  for (let i = 0; i < n; i++) {
    jobs.push({
      start: startTime[i],
      end: endTime[i],
      profit: profit[i],
    });
  }

  // Sort jobs by end time
  jobs.sort((a, b) => a.end - b.end);

  // dp[i] = max profit using jobs[0..i]
  const dp = Array(n).fill(0);
  dp[0] = jobs[0].profit;

  for (let i = 1; i < n; i++) {
    // Option 1: skip current job
    let take = jobs[i].profit;

    // Find last non-overlapping job using binary search
    let left = 0;
    let right = i - 1;
    let lastCompatible = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (jobs[mid].end <= jobs[i].start) {
        lastCompatible = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    if (lastCompatible !== -1) {
      take += dp[lastCompatible];
    }

    // Option 2: skip
    const skip = dp[i - 1];

    dp[i] = Math.max(skip, take);
  }

  return dp[n - 1];
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Job Scheduling Tests ===\n");

const start = [1, 2, 3, 3];
const end = [3, 4, 5, 6];
const p = [50, 10, 40, 70];

console.log("Max Profit:", jobScheduling(start, end, p));
// Expected: 120
// Pick job 1 (1-3, 50) and job 4 (3-6, 70). Total 120.
// Note: [1,3] and [3,6] are non-overlapping (end <= start).
