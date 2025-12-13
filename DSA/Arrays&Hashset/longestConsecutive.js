var longestConsecutive = function (nums) {
  // 1. Handle Edge Case
  if (nums.length === 0) return 0;

  // 2. Create Set for O(1) Lookups
  // This removes duplicates automatically, which is fine.
  const numSet = new Set(nums);

  let maxStreak = 0;

  for (let num of numSet) {
    // 3. The Gatekeeper: Are you the START of a sequence?
    // We check if (num - 1) exists. If it does, we skip this number.
    if (!numSet.has(num - 1)) {
      let currentNum = num;
      let currentStreak = 1;

      // 4. The Runner: Only runs for "Start" numbers
      while (numSet.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
    }
  }

  return maxStreak;
};
