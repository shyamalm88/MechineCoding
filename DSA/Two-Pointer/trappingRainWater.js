/**
 * ============================================================================
 * PROBLEM: Trapping Rain Water (LeetCode #42)
 * ============================================================================
 *
 * Given n non-negative integers representing an elevation map where the
 * width of each bar is 1, compute how much water it can trap after raining.
 *
 * Example 1:
 *
 *             |
 *     |       || |
 *     |~|   |~||~||~|
 *   |~||~|  ||~||~||||
 *   |||||||||||||||||
 *   0 1 0 2 1 0 1 3 2 1 2 1
 *
 * Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
 * Output: 6
 * Explanation: The above elevation map (black bars) is represented by the
 *              array. The trapped water (blue ~) is 6 units.
 *
 * Example 2:
 * Input: height = [4,2,0,3,2,5]
 * Output: 9
 *
 * Constraints:
 * - n == height.length
 * - 1 <= n <= 2 * 10^4
 * - 0 <= height[i] <= 10^5
 *
 * Key Insight:
 * Water at position i = min(leftMax, rightMax) - height[i]
 * We don't need to know both maxes; we only need to know
 * the smaller one to determine the water level.
 *
 * Approach: Two Pointers with running max
 * Time Complexity: O(n) - single pass through array
 * Space Complexity: O(1) - only pointers and max variables
 * ============================================================================
 */

/**
 * @param {number[]} height
 * @return {number}
 */
const trappingRainWater = (height) => {
  let left = 0;
  let right = height.length - 1;

  let leftMax = 0;
  let rightMax = 0;

  let totalWater = 0;

  while (left < right) {
    // Logic: Water level is determined by the shorter of the two walls (left vs right).
    // We process the side with the smaller height because we know its water level is bounded.
    if (height[left] < height[right]) {
      // Left side is the bottleneck
      if (height[left] >= leftMax) {
        // New max height found, update it (cannot trap water on top of a peak)
        leftMax = height[left];
      } else {
        // Current height is less than leftMax.
        // Since height[left] < height[right], we are guaranteed that rightMax > leftMax.
        // Therefore, we can safely trap water up to leftMax level.
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      // Mirror logic for the Right side
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }

  return totalWater;
};

// ============================================================================
// ALTERNATIVE SOLUTION: Prefix/Suffix Max Arrays
// ============================================================================

const trappingRainWaterPrefixSuffix = (height) => {
  const n = height.length;
  if (n === 0) return 0;

  // leftMax[i] = max height from index 0 to i
  const leftMax = new Array(n);
  leftMax[0] = height[0];
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], height[i]);
  }

  // rightMax[i] = max height from index i to n-1
  const rightMax = new Array(n);
  rightMax[n - 1] = height[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], height[i]);
  }

  // Water at each position
  let water = 0;
  for (let i = 0; i < n; i++) {
    water += Math.min(leftMax[i], rightMax[i]) - height[i];
  }

  return water;
};

// ============================================================================
// SAMPLE TEST CASES
// ============================================================================

// Test Case 1: Standard case
console.log("Test 1:", trappingRainWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));
// Expected: 6

// Test Case 2: Another standard case
console.log("Test 2:", trappingRainWater([4, 2, 0, 3, 2, 5]));
// Expected: 9

// Test Case 3: No water (ascending)
console.log("Test 3:", trappingRainWater([1, 2, 3, 4, 5]));
// Expected: 0

// Test Case 4: No water (descending)
console.log("Test 4:", trappingRainWater([5, 4, 3, 2, 1]));
// Expected: 0

// Test Case 5: Single valley
console.log("Test 5:", trappingRainWater([3, 0, 3]));
// Expected: 3

// Test Case 6: Multiple valleys
console.log("Test 6:", trappingRainWater([5, 0, 5, 0, 5]));
// Expected: 10 (5 + 5)

// Test Case 7: Empty array
console.log("Test 7:", trappingRainWater([]));
// Expected: 0

// Test Case 8: Single element
console.log("Test 8:", trappingRainWater([5]));
// Expected: 0

// Test Case 9: Two elements
console.log("Test 9:", trappingRainWater([5, 0]));
// Expected: 0 (no wall on right to trap)

// Test with prefix/suffix approach
console.log("\n--- Prefix/Suffix Approach ---");
console.log(
  "Test 1 (Prefix):",
  trappingRainWaterPrefixSuffix([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])
);
// Expected: 6

// Visual explanation:
//
// For each position, water level = min(leftMax, rightMax) - height[i]
//
//        leftMax[i]                    rightMax[i]
//             |                              |
//             v                              v
//     |       xxxxxxxxxxxxxxxxxxxxxxx        |
//     |       x   x   x   x   x     x        |
//   ~~|~~~~~~~x~~~x~~~x~~~x~~~x~~~~~x~~~~~~~~|~~  <- water level
//     |       x   x   x   x   x     x        |
//     |_______|___|___|___|___|_____|________|
//
// Two-pointer optimization: We only need to track one side at a time
// because the water level is determined by the SMALLER of the two maxes.
