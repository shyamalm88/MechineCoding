# JavaScript Problems

Pure JavaScript coding problems focusing on data structures, algorithms, and practical programming challenges.

## Structure

```
javascript-problems/
├── data-transformation/    # Problems involving data manipulation, merging, transformation
├── arrays/                 # Array manipulation and algorithms
├── objects/                # Object operations and transformations
├── strings/                # String processing problems
└── algorithms/             # General algorithm implementations
```

## How to Run

All JavaScript files can be run directly with Node.js:

```bash
node javascript-problems/data-transformation/gym-sessions-merger.js
```

## Current Problems

### Data Transformation

#### Gym Sessions Merger
**File:** `data-transformation/gym-sessions-merger.js`

**Problem:** Merge gym session records by user ID, combining durations and de-duplicating equipment while preserving order.

**Key Concepts:**
- Map for tracking and order preservation
- Set for de-duplication
- Array cloning to prevent mutation
- Sorting and data transformation

**Complexity:** O(n * m log m) where n = sessions, m = equipment per user

**Run:**
```bash
node javascript-problems/data-transformation/gym-sessions-merger.js
```

---

## Adding New Problems

1. Create a file in the appropriate category folder
2. Include:
   - Problem description
   - Solution with comments
   - Test cases with assertions
   - Complexity analysis
   - Key learning points

### Template Structure

```javascript
/**
 * Problem Title
 *
 * Problem description here...
 *
 * Time Complexity: O(?)
 * Space Complexity: O(?)
 */

// ==================== SOLUTION ====================

function solutionName(input) {
  // Your solution here
}

// ==================== TEST CASES ====================

console.log('=== Problem Title ===\n')

// Test cases with console.log

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

// Run tests here

// ==================== EXPORTS ====================
export { solutionName }
```

---

## Tips

- All files use ES modules (export/import syntax)
- Include comprehensive test cases
- Add detailed comments explaining the approach
- Document time and space complexity
- Include common mistakes and edge cases
- Add interview follow-up questions

---

Happy coding! 🚀
