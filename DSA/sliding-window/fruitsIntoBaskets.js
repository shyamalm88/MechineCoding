/**
 * ============================================================================
 * PROBLEM: Fruit Into Baskets (LeetCode #904)
 * ============================================================================
 * You have two baskets, each can hold only ONE type of fruit (but any count).
 * Given an array fruits[] where fruits[i] is the type of fruit at tree i,
 * find the maximum number of fruits you can pick starting from any tree,
 * picking ONE from each consecutive tree (no skipping).
 *
 * This is equivalent to: Longest subarray with at most 2 distinct values.
 *
 * Example 1:
 * Input: fruits=[1,2,1]   → Output: 3  (pick all)
 * Example 2:
 * Input: fruits=[0,1,2,2] → Output: 3  ([1,2,2])
 * Example 3:
 * Input: fruits=[1,2,3,2,2] → Output: 4  ([2,3,2,2])
 *
 * Constraints:
 * - 1 <= fruits.length <= 10^5
 * - 0 <= fruits[i] < fruits.length
 */

// ============================================================================
// APPROACH: Sliding Window — at most 2 distinct types in window
// ============================================================================
/**
 * STORY / INTUITION:
 * Two baskets = at most 2 distinct fruit types in our window.
 * Use a Map to track { fruitType → count in window }.
 * When map.size > 2, we have 3 types — shrink from left:
 *   decrement count, if count hits 0, delete from map.
 * At each step, window is valid (≤ 2 types). Track max length.
 *
 * SAME TEMPLATE as LeetCode #340 (at most K distinct characters).
 * Just set K=2.
 *
 * DRY RUN (fruits=[1,2,3,2,2]):
 * r=0(1): map={1:1}, size=1
 * r=1(2): map={1:1,2:1}, size=2
 * r=2(3): map={1:1,2:1,3:1}, size=3 > 2 → shrink:
 *   l=0(1): map={2:1,3:1}. size=2. Stop. win=[1..2] len=2
 * r=3(2): map={2:2,3:1}, size=2, win=[1..3] len=3
 * r=4(2): map={2:3,3:1}, size=2, win=[1..4] len=4
 * Result: 4
 *
 * Time:  O(N)
 * Space: O(1) — map has at most 3 entries at any time
 */
const totalFruit = (fruits) => {
  const basket = new Map(); // fruit type → count in window
  let left = 0;
  let maxPick = 0;

  for (let right = 0; right < fruits.length; right++) {
    const fruit = fruits[right];
    basket.set(fruit, (basket.get(fruit) || 0) + 1);

    // 3rd type detected — shrink from left
    while (basket.size > 2) {
      const leftFruit = fruits[left];
      basket.set(leftFruit, basket.get(leftFruit) - 1);
      if (basket.get(leftFruit) === 0) basket.delete(leftFruit);
      left++;
    }

    maxPick = Math.max(maxPick, right - left + 1);
  }

  return maxPick;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Fruits Into Baskets Tests ===\n");

console.log("Test 1:", totalFruit([1, 2, 1]));       // Expected: 3
console.log("Test 2:", totalFruit([0, 1, 2, 2]));    // Expected: 3
console.log("Test 3:", totalFruit([1, 2, 3, 2, 2])); // Expected: 4
console.log("Test 4:", totalFruit([3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4])); // Expected: 5

module.exports = { totalFruit };
