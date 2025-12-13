/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function (nums) {
  let left = 0;
  let right = nums.length - 1;

  // Use left < right (Stop when they meet)
  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    // Compare Mid with Right
    if (nums[mid] > nums[right]) {
      // The slope is broken. Min is to the Right.
      left = mid + 1;
    } else {
      // The slope is correct (Mid < Right).
      // Min could be Mid, or to the Left.
      // We cannot discard Mid, so we set right = mid
      right = mid;
    }
  }

  // When left == right, we found the smallest element
  return nums[left];
};
