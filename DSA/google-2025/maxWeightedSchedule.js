function maxWeightedSchedule(intervals) {
  intervals.sort((a, b) => a.end - b.end);
  const n = intervals.length;
  const dp = Array(n).fill(0);

  const findLastNonOverlap = (i) => {
    let lo = 0,
      hi = i - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (intervals[mid].end <= intervals[i].start) {
        if (mid + 1 < i && intervals[mid + 1].end <= intervals[i].start) {
          lo = mid + 1;
        } else {
          return mid;
        }
      } else {
        hi = mid - 1;
      }
    }
    return -1;
  };

  dp[0] = intervals[0].weight;

  for (let i = 1; i < n; i++) {
    const include =
      intervals[i].weight +
      (findLastNonOverlap(i) !== -1 ? dp[findLastNonOverlap(i)] : 0);

    dp[i] = Math.max(dp[i - 1], include);
  }

  return dp[n - 1];
}
