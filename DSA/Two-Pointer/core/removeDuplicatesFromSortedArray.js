/**
 * PROBLEM: Remove Duplicates from Sorted Array (LeetCode #26)
 *
 * Remove duplicates IN PLACE so each value appears once; return the new length.
 * The first k elements must hold the result.
 *
 * INTUITION:
 * Slow/fast pointers on sorted input. `slow` marks the end of the deduplicated
 * prefix; `fast` scans ahead. Because the array is sorted, a duplicate is only
 * ever adjacent, so comparing nums[fast] to nums[slow] is sufficient.
 *
 * DRY RUN: [0,0,1,1,1,2]
 *   fast=1 equal → skip
 *   fast=2 differs → slow=1, nums[1]=1
 *   fast=3,4 equal → skip
 *   fast=5 differs → slow=2, nums[2]=2
 *   length = 3, array starts [0,1,2]
 *
 * TIME: O(n)   SPACE: O(1)
 */
const removeDuplicates = (nums) => {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1; // length, not index
};

const a = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
console.log(removeDuplicates(a), a.slice(0, 5)); // 5 [0,1,2,3,4]
console.log(removeDuplicates([1, 1, 2])); // 2
console.log(removeDuplicates([])); // 0
