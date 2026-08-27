function canPartition(nums) {
  const totalSum = nums.reduce((a, b) => a + b, 0);
  if (totalSum % 2 !== 0) return false;

  const target = totalSum / 2;
  const dp = Array(target + 1).fill(false);
  dp[0] = true;

  for (const num of nums) {
    for (let s = target; s >= num; s--) {
      dp[s] = dp[s] || dp[s - num];
    }
  }

  return dp[target];
}
