/**
 * PROBLEM: Find All Numbers Disappeared in an Array (LeetCode #448)
 *
 * nums has n integers in [1, n]. Return every value in that range that is absent.
 *
 * INTUITION:
 * The O(n) space answer is a Set. The interesting one uses the array ITSELF as
 * the marker: value v belongs at index v-1, so for each value mark that index
 * negative. Any index still positive at the end was never visited, so index+1
 * is missing.
 *
 * Math.abs is essential when reading — the slot may already be marked.
 *
 * DRY RUN: [4,3,2,7,8,2,3,1]
 *   mark idx 3,2,1,6,7,1,2,0 negative
 *   positive slots remain at idx 4 and 5 → missing 5 and 6
 *
 * TIME: O(n)   SPACE: O(1) excluding the output
 */
const findDisappearedNumbers = (nums) => {
  for (const n of nums) {
    const idx = Math.abs(n) - 1;
    if (nums[idx] > 0) nums[idx] = -nums[idx]; // mark as seen
  }
  const out = [];
  for (let i = 0; i < nums.length; i++) if (nums[i] > 0) out.push(i + 1);
  return out;
};

console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5,6]
console.log(findDisappearedNumbers([1, 1])); // [2]
