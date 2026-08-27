// ============================================================================
// APPROACH: Sliding Window — "at most K zeros" in window
// ============================================================================
/**
 * STORY / INTUITION:
 * The window represents a segment we're "considering flipping". We allow up to
 * K zeros inside it (they represent the flips we use). When zeros > K, the
 * window has too many 0s to flip — shrink from left until zeros == K again.
 *
 * At every step, the window [left, right] is a valid segment (zeros <= K).
 * Track max window size.
 *
 * PATTERN NOTE: This exact template solves many problems:
 * "Longest subarray / substring with at most K bad elements"
 *
 * DRY RUN (nums=[1,1,0,0,1,1], k=1):
 * r=0(1): zeros=0, win=1
 * r=1(1): zeros=0, win=2
 * r=2(0): zeros=1, win=3  ← used 1 flip
 * r=3(0): zeros=2 > k! Shrink left: l=0(1), zeros still 2. l=1(1), still 2. l=2(0), zeros=1. l=3.
 *         window=[3..3], win=1
 * r=4(1): zeros=1, win=2
 * r=5(1): zeros=1, win=3
 * Result: 3
 *
 * Time:  O(N)
 * Space: O(1)
 */
const longestOnes = (nums, k) => {
  let left = 0;
  let zeros = 0;
  let maxLen = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;

    // Too many zeros — shrink left until we're valid again
    while (zeros > k) {
      if (nums[left] === 0) zeros--;
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Max Consecutive Ones III Tests ===\n");

console.log("Test 1:", longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)); // Expected: 6
console.log("Test 2:", longestOnes([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 3)); // Expected: 10
console.log("Test 3:", longestOnes([0, 0, 0], 0)); // Expected: 0
console.log("Test 4:", longestOnes([1, 1, 1], 0)); // Expected: 3

module.exports = { longestOnes };
