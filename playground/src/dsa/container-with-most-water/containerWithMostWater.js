/**
 * @param {number[]} height
 * @return {number}
 */
const containerWithMostWater = (height) => {
  let left = 0;
  let right = height.length - 1;
  let max = 0;

  while (left < right) {
    // 1. Calculate Area
    // Width = right - left
    // Height = min(height[left], height[right])
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    const area = h * width;

    // 2. Update max
    max = Math.max(area, max);

    // 3. Greedy Move: Always move the shorter wall inward.
    // Moving the taller wall can only decrease width without increasing height (limited by short wall).
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return max;
};

// ============================================================================
// SAMPLE TEST CASES
// ============================================================================

// Test Case 1: Standard case
console.log("Test 1:", containerWithMostWater([1, 8, 6, 2, 5, 4, 8, 3, 7]));
// Expected: 49 (between indices 1 and 8, min(8,7) * 7 = 49)

// Test Case 2: Minimum size
console.log("Test 2:", containerWithMostWater([1, 1]));
// Expected: 1

// Test Case 3: Increasing heights
console.log("Test 3:", containerWithMostWater([1, 2, 3, 4, 5]));
// Expected: 6 (between indices 0 and 4, min(1,5) * 4 = 4... or 1,4 = 6)

// Test Case 4: Decreasing heights
console.log("Test 4:", containerWithMostWater([5, 4, 3, 2, 1]));
// Expected: 6 (between indices 0 and 4, min(5,1) * 4 = 4... or 0,3 = 6)

// Test Case 5: Equal heights
console.log("Test 5:", containerWithMostWater([4, 4, 4, 4, 4]));
// Expected: 16 (between indices 0 and 4, min(4,4) * 4 = 16)

// Test Case 6: Tallest walls at ends
console.log("Test 6:", containerWithMostWater([10, 1, 1, 1, 10]));
// Expected: 40 (between indices 0 and 4, min(10,10) * 4 = 40)

// Test Case 7: Tallest walls in middle
console.log("Test 7:", containerWithMostWater([1, 10, 10, 1]));
// Expected: 10 (between indices 1 and 2, min(10,10) * 1 = 10, or 0-3 = 3)

// Visual explanation of the algorithm:
//
//     |                 |
//     |                 |
//     | - - - - - - - - |
//     |                 |
//   L                   R
//
// Start with widest container (left=0, right=n-1)
// Always move the pointer pointing to the shorter wall
// Why? Because keeping the shorter wall and moving the taller one
// can never increase the area (area is limited by shorter wall)
