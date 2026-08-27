/**
 * PROBLEM: Fruit Into Baskets (LeetCode #904)
 *
 * Longest subarray containing at most 2 distinct values.
 *
 * INTUITION:
 * "At most K distinct" is the standard variable-size sliding window: expand
 * right always, and shrink from the left only while the window is INVALID
 * (more than K distinct). Every valid window is measured, so the maximum is
 * found in one pass.
 *
 * A Map of value → count is what makes "how many distinct?" O(1); delete the
 * key when its count hits zero or the distinct count never drops.
 *
 * DRY RUN: [1,2,3,2,2], K=2
 *   window grows to [1,2] len 2
 *   3 arrives → 3 distinct → shrink until [2,3]
 *   then [2,3,2,2] len 4 → answer 4
 *
 * TIME: O(n) -- each index enters and leaves once   SPACE: O(K)
 */
const totalFruit = (fruits, k = 2) => {
  const count = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < fruits.length; right++) {
    count.set(fruits[right], (count.get(fruits[right]) ?? 0) + 1);

    while (count.size > k) {
      const leftFruit = fruits[left];
      count.set(leftFruit, count.get(leftFruit) - 1);
      if (count.get(leftFruit) === 0) count.delete(leftFruit);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
};

console.log(totalFruit([1, 2, 1])); // 3
console.log(totalFruit([0, 1, 2, 2])); // 3
console.log(totalFruit([1, 2, 3, 2, 2])); // 4
