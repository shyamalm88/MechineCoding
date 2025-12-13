/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place.
 */
var nextPermutation = function (nums) {
  let i = nums.length - 2;

  // 🟢 STEP 1: Find the Pivot (First dip from the right)
  // We look for the first number that is SMALLER than its right neighbor.
  while (i >= 0 && nums[i] >= nums[i + 1]) {
    i--;
  }

  // Check if a pivot was actually found.
  // If i == -1, the array is [3, 2, 1] (Maxed out), so we skip to Step 3.
  if (i >= 0) {
    // 🟢 STEP 2: Find the Successor
    // Look for the smallest number > nums[i] from the right side.
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) {
      j--;
    }

    // Swap them
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  // 🟢 STEP 3: Reverse the Tail
  // The part after 'i' is currently Descending. We flip it to Ascending.
  let left = i + 1;
  let right = nums.length - 1;

  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
};
