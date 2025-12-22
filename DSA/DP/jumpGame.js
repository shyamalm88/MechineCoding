const canJump = (nums) => {
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    // If we can't even reach this index
    if (i > maxReach) return false;

    // Update farthest reachable index
    maxReach = Math.max(maxReach, i + nums[i]);
  }

  return true;
};
