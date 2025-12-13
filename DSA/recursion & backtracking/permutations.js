/**
 * @param {number[]} nums
 * @return {number[][]}
 */
const permute = (nums) => {
  const result = [];

  const backTrack = (curr) => {
    // 1. Base Case
    if (curr.length === nums.length) {
      // 🛑 CRITICAL FIX: Push a COPY, not the reference
      result.push([...curr]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      // 2. Filter (Skip used numbers)
      if (curr.includes(nums[i])) {
        continue;
      }

      // 3. Action
      curr.push(nums[i]);

      // 4. Recurse
      backTrack(curr);

      // 5. Backtrack (Undo)
      curr.pop();
    }
  };

  backTrack([]);
  return result;
};
