/**
 * PROBLEM: Binary Search (LeetCode #704)
 *
 * Return the index of target in a sorted array, or -1.
 *
 * INTUITION:
 * The template everything else in this category is built on. Three details are
 * where bugs live:
 *
 *  1. `mid = low + Math.floor((high - low) / 2)` rather than (low+high)/2 --
 *     the latter can overflow in fixed-width languages. Harmless in JS, but
 *     interviewers look for it.
 *  2. `while (low <= high)` with an INCLUSIVE high. Using `<` skips the final
 *     single-element window.
 *  3. Move past mid (`mid + 1` / `mid - 1`), never to mid, or the range never
 *     shrinks and it loops forever.
 *
 * DRY RUN: [-1,0,3,5,9,12] target 9
 *   lo0 hi5 mid2 (3<9) → lo3
 *   lo3 hi5 mid4 (9==9) → return 4
 *
 * TIME: O(log n)   SPACE: O(1)
 */
const search = (nums, target) => {
  let low = 0;
  let high = nums.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
};

console.log(search([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log(search([-1, 0, 3, 5, 9, 12], 2)); // -1
console.log(search([5], 5), search([], 1)); // 0 -1
