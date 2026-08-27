// ============================================================================
// APPROACH: Variable-Size Sliding Window
// ============================================================================
/**
 * STORY / INTUITION:
 * Expand the right edge until the window sum >= target (valid window found).
 * Then shrink the left edge as much as possible while sum stays >= target
 * to minimize window length. Record the minimum each time we're valid.
 *
 * Why not fixed window? We don't know the length upfront. So we grow freely
 * and shrink greedily.
 *
 * DRY RUN (target=7, nums=[2,3,1,2,4,3]):
 * r=0: sum=2  → not valid
 * r=1: sum=5  → not valid
 * r=2: sum=6  → not valid
 * r=3: sum=8  → VALID! len=4. Shrink: remove 2 → sum=6 < 7. Stop.
 * r=4: sum=10 → VALID! len=4. Shrink: remove 3 → sum=7 >= 7. len=3. Shrink: remove 1 → sum=6. Stop.
 * r=5: sum=9  → VALID! len=3. Shrink: remove 2 → sum=7 >= 7. len=2! Shrink: remove 4 → sum=3. Stop.
 * Result: 2
 *
 * Time:  O(N) — each element enters and leaves the window at most once
 * Space: O(1)
 */
const minSubArrayLen = (target, nums) => {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];

    // Shrink from left as long as window is valid
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Minimum Size Subarray Sum Tests ===\n");

console.log("Test 1:", minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // Expected: 2
console.log("Test 2:", minSubArrayLen(4, [1, 4, 4]));           // Expected: 1
console.log("Test 3:", minSubArrayLen(11, [1, 1, 1, 1, 1]));    // Expected: 0

module.exports = { minSubArrayLen };
