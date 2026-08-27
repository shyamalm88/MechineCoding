function findTargetSumWays(nums, target) {
  const totalSum = nums.reduce((a, b) => a + b, 0);

  if (target + totalSum < 0 || (target + totalSum) % 2 !== 0) {
    return 0;
  }

  const requiredSum = (target + totalSum) / 2;

  const dp = Array(requiredSum + 1).fill(0);
  dp[0] = 1;

  for (const num of nums) {
    for (let s = requiredSum; s >= num; s--) {
      dp[s] += dp[s - num];
    }
  }

  return dp[requiredSum];
}
