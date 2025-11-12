/**
 * TWO SUM (LeetCode #1)
 *
 * Problem:
 * Given an array of integers `nums` and an integer `target`,
 * return indices of the two numbers such that they add up to target.
 * Assume exactly one solution exists, and you cannot use the same element twice.
 *
 * Example:
 * Input: nums = [2, 7, 11, 15], target = 9
 * Output: [0, 1]  (because nums[0] + nums[1] = 2 + 7 = 9)
 *
 * Constraints:
 * - 2 <= nums.length <= 10^4
 * - -10^9 <= nums[i] <= 10^9
 * - Exactly one solution exists
 */

// ==================== BRUTE FORCE ====================
/**
 * Brute force: try all pairs
 * Time: O(n²) - nested loops
 * Space: O(1) - no extra space
 */
function twoSumBrute(nums, target) {
  // Check every pair (i, j) where i < j
  for (let i = 0; i < nums.length - 1; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      // If pair sums to target, return indices
      if (nums[i] + nums[j] === target) {
        return [i, j]
      }
    }
  }
  // Should never reach here (problem guarantees solution exists)
  return null
}

// ==================== OPTIMAL (HASH MAP) ====================
/**
 * Optimal: single-pass hash map
 * Time: O(n) - one pass through array
 * Space: O(n) - hash map stores up to n elements
 *
 * Key insight:
 * For each num, check if (target - num) already seen.
 * If yes → found pair.
 * If no → store num's index in map for future lookups.
 */
function twoSumOptimal(nums, target) {
  // Map: value → index
  const seen = new Map()

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i]
    const complement = target - num

    // Check if complement already exists in map
    if (seen.has(complement)) {
      // Found pair: complement's index + current index
      return [seen.get(complement), i]
    }

    // Store current number's index for future lookups
    seen.set(num, i)
  }

  // Should never reach here (problem guarantees solution)
  return null
}

// ==================== DRY RUN ====================
/**
 * Example: nums = [2, 7, 11, 15], target = 9
 *
 * i=0, num=2, complement=7, seen={} → add 2
 * i=1, num=7, complement=2, seen={2:0} → FOUND! return [0, 1]
 */

// ==================== TEST HARNESS ====================
function assertEq(actual, expected, label = '') {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  console.log((ok ? '✅' : '❌'), label, 'got:', actual, 'expected:', expected)
}

console.log('=== Two Sum Tests ===\n')

// Test 1: Basic example
assertEq(twoSumBrute([2, 7, 11, 15], 9), [0, 1], 'Brute: basic')
assertEq(twoSumOptimal([2, 7, 11, 15], 9), [0, 1], 'Optimal: basic')

// Test 2: Pair at end
assertEq(twoSumBrute([3, 2, 4], 6), [1, 2], 'Brute: pair at end')
assertEq(twoSumOptimal([3, 2, 4], 6), [1, 2], 'Optimal: pair at end')

// Test 3: Duplicates
assertEq(twoSumBrute([3, 3], 6), [0, 1], 'Brute: duplicates')
assertEq(twoSumOptimal([3, 3], 6), [0, 1], 'Optimal: duplicates')

// Test 4: Negative numbers
assertEq(twoSumBrute([-1, -2, -3, -4, -5], -8), [2, 4], 'Brute: negatives')
assertEq(twoSumOptimal([-1, -2, -3, -4, -5], -8), [2, 4], 'Optimal: negatives')

// Test 5: Large array (only optimal for performance)
const largeArray = Array.from({ length: 10000 }, (_, i) => i)
largeArray.push(5000) // Now 5000 + 5000 won't work, need 0 + 10000
assertEq(twoSumOptimal([...largeArray, 10000], 10000), [0, 10001], 'Optimal: large array')

console.log('\n=== Edge Cases ===')

// Edge case 1: Minimum size (n=2)
assertEq(twoSumOptimal([1, 2], 3), [0, 1], 'Min size array')

// Edge case 2: Zero in array
assertEq(twoSumOptimal([0, 4, 3, 0], 0), [0, 3], 'Zeros in array')

// Edge case 3: Large numbers
assertEq(twoSumOptimal([1000000000, -1000000000], 0), [0, 1], 'Large numbers')

console.log('\n=== Complexity Analysis ===')
console.log('Brute Force: Time O(n²), Space O(1)')
console.log('Optimal:     Time O(n),  Space O(n)')
console.log('\nGotchas:')
console.log('- Cannot use same element twice (i ≠ j)')
console.log('- Exactly one solution guaranteed (no need to handle "no solution")')
console.log('- Hash map handles duplicates correctly (stores latest index)')
console.log('- Works with negatives, zeros, and large numbers')
