var searchInRotatedSortedArray = function (nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // 🟢 STEP 1: Find the Sorted Half
    if (nums[left] <= nums[mid]) {
      // LEFT is Sorted

      // 🟢 STEP 2: Is target inside this sorted range?
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // Yes, go Left
      } else {
        left = mid + 1; // No, go Right
      }
    } else {
      // RIGHT is Sorted (Implied)

      // 🟢 STEP 2: Is target inside this sorted range?
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1; // Yes, go Right
      } else {
        right = mid - 1; // No, go Left
      }
    }
  }
  return -1;
};
