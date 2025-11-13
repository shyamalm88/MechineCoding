/**
 * Gym Sessions Data Merger
 *
 * Problem: Merge gym session records by user ID
 * - Sum durations
 * - Combine and de-duplicate equipment
 * - Preserve original order (merged record at first occurrence)
 *
 * Time Complexity: O(n * m log m) where n = sessions, m = equipment per user
 * Space Complexity: O(n)
 *
 * Key Concepts:
 * - Map for tracking user data and order
 * - Set for de-duplication
 * - Array cloning to prevent mutation
 */

// ==================== SOLUTION ====================

/**
 * Merges gym session data by user ID
 * @param {Array} sessions - Array of session objects
 * @returns {Array} Merged sessions
 */
function mergeData(sessions) {
  // Edge case: empty input
  if (!sessions || sessions.length === 0) {
    return []
  }

  // Map to track: user ID -> index in result array
  const userIndexMap = new Map()
  const result = []

  sessions.forEach((session) => {
    if (!userIndexMap.has(session.user)) {
      // First occurrence: add new entry to result
      const index = result.length
      userIndexMap.set(session.user, index)
      result.push({
        user: session.user,
        duration: session.duration,
        // IMPORTANT: Clone the equipment array to avoid mutation
        equipment: [...session.equipment],
      })
    } else {
      // User already exists: merge with existing entry
      const index = userIndexMap.get(session.user)
      result[index].duration += session.duration
      // Append equipment (will de-duplicate later)
      result[index].equipment.push(...session.equipment)
    }
  })

  // Post-process: de-duplicate and sort equipment for each user
  result.forEach((user) => {
    // Use Set to remove duplicates, then sort alphabetically
    user.equipment = [...new Set(user.equipment)].sort()
  })

  return result
}

// ==================== TEST CASES ====================

const sessions = [
  { user: 8, duration: 50, equipment: ['bench'] },
  { user: 7, duration: 150, equipment: ['dumbbell'] },
  { user: 1, duration: 10, equipment: ['barbell'] },
  { user: 7, duration: 100, equipment: ['bike', 'kettlebell'] },
  { user: 7, duration: 200, equipment: ['bike'] },
  { user: 2, duration: 200, equipment: ['treadmill'] },
  { user: 2, duration: 200, equipment: ['bike'] },
]

console.log('=== Gym Sessions Merger ===\n')

console.log('Original Sessions:')
console.log(JSON.stringify(sessions, null, 2))

console.log('\nMerged Result:')
const merged = mergeData(sessions)
console.log(JSON.stringify(merged, null, 2))

// ==================== ASSERTIONS ====================

function assertEqual(actual, expected, testName) {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)

  if (actualStr === expectedStr) {
    console.log(`✅ PASS: ${testName}`)
  } else {
    console.log(`❌ FAIL: ${testName}`)
    console.log(`   Expected: ${expectedStr}`)
    console.log(`   Got:      ${actualStr}`)
  }
}

console.log('\n=== Running Tests ===\n')

// Test 1: Basic merge
const test1Input = [
  { user: 1, duration: 100, equipment: ['bench'] },
  { user: 1, duration: 50, equipment: ['dumbbell'] },
]
const test1Expected = [
  { user: 1, duration: 150, equipment: ['bench', 'dumbbell'] }
]
assertEqual(mergeData(test1Input), test1Expected, 'Test 1: Basic merge')

// Test 2: Order preservation
const test2Input = [
  { user: 2, duration: 100, equipment: ['bike'] },
  { user: 1, duration: 50, equipment: ['bench'] },
  { user: 2, duration: 200, equipment: ['treadmill'] },
]
const test2Expected = [
  { user: 2, duration: 300, equipment: ['bike', 'treadmill'] },
  { user: 1, duration: 50, equipment: ['bench'] },
]
assertEqual(mergeData(test2Input), test2Expected, 'Test 2: Order preservation')

// Test 3: Equipment de-duplication
const test3Input = [
  { user: 7, duration: 100, equipment: ['bike', 'dumbbell'] },
  { user: 7, duration: 200, equipment: ['bike', 'kettlebell'] },
]
const test3Expected = [
  { user: 7, duration: 300, equipment: ['bike', 'dumbbell', 'kettlebell'] }
]
assertEqual(mergeData(test3Input), test3Expected, 'Test 3: Equipment de-duplication')

// Test 4: Empty array
assertEqual(mergeData([]), [], 'Test 4: Empty array')

// Test 5: Single session
const test5Input = [{ user: 1, duration: 50, equipment: ['bench'] }]
const test5Expected = [{ user: 1, duration: 50, equipment: ['bench'] }]
assertEqual(mergeData(test5Input), test5Expected, 'Test 5: Single session')

// Test 6: All same user
const test6Input = [
  { user: 7, duration: 100, equipment: ['bike'] },
  { user: 7, duration: 200, equipment: ['bike'] },
]
const test6Expected = [
  { user: 7, duration: 300, equipment: ['bike'] }
]
assertEqual(mergeData(test6Input), test6Expected, 'Test 6: All same user')

// Test 7: Main example from problem
const test7Expected = [
  { user: 8, duration: 50, equipment: ['bench'] },
  { user: 7, duration: 450, equipment: ['bike', 'dumbbell', 'kettlebell'] },
  { user: 1, duration: 10, equipment: ['barbell'] },
  { user: 2, duration: 400, equipment: ['bike', 'treadmill'] },
]
assertEqual(mergeData(sessions), test7Expected, 'Test 7: Main example')

console.log('\n=== All Tests Complete ===')

// ==================== EXPORTS ====================
export { mergeData }

/**
 * HOW TO RUN:
 *
 * node javascript-problems/data-transformation/gym-sessions-merger.js
 *
 * COMPLEXITY ANALYSIS:
 *
 * Time: O(n * m log m)
 *   - Iterate through sessions: O(n)
 *   - For each user, append equipment: O(1) amortized
 *   - De-duplicate equipment: O(m) per user using Set
 *   - Sort equipment: O(m log m) per user
 *   - Total users ≤ n, so: O(n * m log m)
 *   - In practice: m is small (5 equipment types), so effectively O(n)
 *
 * Space: O(n)
 *   - Map stores one entry per unique user: O(unique users)
 *   - Result array: O(n) worst case (all different users)
 *   - Temporary equipment arrays: O(m) per user
 *
 * KEY LEARNING POINTS:
 *
 * 1. Map for Order Preservation
 *    - Map maintains insertion order (ES6+ guaranteed)
 *    - Track first occurrence position explicitly
 *
 * 2. Array Cloning
 *    - Use spread operator [...array] to prevent mutation
 *    - "The input objects should not be modified" (requirement)
 *
 * 3. De-duplication with Set
 *    - Set automatically removes duplicates
 *    - Convert back to array: [...new Set(arr)]
 *
 * 4. Alphabetical Sorting
 *    - Default .sort() works for strings
 *    - No custom comparator needed
 *
 * COMMON MISTAKES:
 *
 * ❌ Mutating original equipment arrays
 * ❌ Using Object instead of Map (order not guaranteed in all JS versions)
 * ❌ Forgetting to de-duplicate equipment
 * ❌ Sorting before de-duplicating (inefficient)
 * ❌ Not preserving original order
 *
 * INTERVIEW FOLLOW-UPS:
 *
 * Q: What if equipment wasn't pre-sorted in input?
 * A: Same solution works - we sort at the end anyway
 *
 * Q: What if there are millions of sessions?
 * A: Current O(n) solution is optimal for single-pass processing
 *
 * Q: How to handle invalid data?
 * A: Add validation:
 *    if (!session.user || session.duration < 0) throw new Error(...)
 *
 * Q: What if we want to track session count per user?
 * A: Add sessionCount field, increment during merge
 */
