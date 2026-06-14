/**
 * ============================================================================
 * PROBLEM: Maximum Points You Can Obtain from Cards (LeetCode #1423)
 * ============================================================================
 * There are n cards in a row with values cardPoints[]. In one step you can
 * take one card from the beginning or end. You take exactly k cards total.
 * Return the maximum sum of the k chosen cards.
 *
 * Example 1:
 * Input: cardPoints=[1,2,3,4,5,6,1], k=3
 * Output: 12  (take [6,1] from right and [1] from left? No: take last 3: 5+6+1=12)
 *
 * Example 2:
 * Input: cardPoints=[2,2,2], k=2
 * Output: 4
 *
 * Example 3:
 * Input: cardPoints=[9,7,7,9,7,7,9], k=7
 * Output: 55  (all cards)
 *
 * Constraints:
 * - 1 <= cardPoints.length <= 10^5
 * - 1 <= cardPoints[i] <= 10^4
 * - 1 <= k <= cardPoints.length
 */

// ============================================================================
// APPROACH: Reverse Sliding Window — minimize the middle subarray
// ============================================================================
/**
 * STORY / INTUITION:
 * We always take k cards from the left end, right end, or a mix.
 * The cards we DON'T take form a contiguous subarray in the middle of length (n - k).
 * So the problem flips to: find the MINIMUM sum subarray of length (n - k).
 * Answer = total sum - minimum middle window.
 *
 * VISUAL:
 * [left cards] [... middle window we skip ...] [right cards]
 *  (some from left)       (n-k cards)           (some from right)
 *
 * If k == n → we take everything, windowSize = 0, min window sum = 0.
 *
 * DRY RUN (cardPoints=[1,2,3,4,5,6,1], k=3):
 * total=22, windowSize=7-3=4
 * Initial window [1,2,3,4], sum=10
 * Slide:
 *   remove 1, add 5 → [2,3,4,5] sum=14
 *   remove 2, add 6 → [3,4,5,6] sum=18
 *   remove 3, add 1 → [4,5,6,1] sum=16
 * minWindowSum=10 → Answer=22-10=12
 *
 * Time:  O(N)
 * Space: O(1)
 */
const maxScore = (cardPoints, k) => {
  const n = cardPoints.length;
  const total = cardPoints.reduce((s, x) => s + x, 0);
  const windowSize = n - k;

  if (windowSize === 0) return total; // take all cards

  // Initialize first window
  let windowSum = 0;
  for (let i = 0; i < windowSize; i++) {
    windowSum += cardPoints[i];
  }

  let minWindow = windowSum;

  // Slide the window across
  for (let i = windowSize; i < n; i++) {
    windowSum += cardPoints[i] - cardPoints[i - windowSize];
    minWindow = Math.min(minWindow, windowSum);
  }

  return total - minWindow;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Maximum Points From Cards Tests ===\n");

console.log("Test 1:", maxScore([1, 2, 3, 4, 5, 6, 1], 3)); // Expected: 12
console.log("Test 2:", maxScore([2, 2, 2], 2));              // Expected: 4
console.log("Test 3:", maxScore([9, 7, 7, 9, 7, 7, 9], 7)); // Expected: 55
console.log("Test 4:", maxScore([1, 79, 80, 1, 1, 1, 200, 1], 3)); // Expected: 202

module.exports = { maxScore };
