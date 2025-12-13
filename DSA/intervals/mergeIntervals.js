/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  if (intervals.length === 0) return [];

  // 1. Create a copy using spread syntax [...] or .slice()
  // This prevents mutating the original data passed by the caller.
  const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0]);

  const result = [sortedIntervals[0]];

  for (let i = 1; i < sortedIntervals.length; i++) {
    const current = sortedIntervals[i];
    const lastMerged = result[result.length - 1];

    // 2. Logic remains the same: Check Overlap
    if (current[0] <= lastMerged[1]) {
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      result.push(current);
    }
  }

  return result;
};
