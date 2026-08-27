// ============================================================================
// APPROACH: Boyer-Moore Voting Algorithm (extended for n/3)
// ============================================================================
/**
 * STORY / INTUITION:
 * CORE IDEA from majority element (#169): A majority element (> n/2) "outvotes"
 * all others combined. Extend this: at most 2 elements can appear > n/3 times.
 * So we maintain 2 candidates and 2 counters.
 *
 * VOTING RULES:
 * - If current num == candidate1 → count1++
 * - Else if current num == candidate2 → count2++
 * - Else if count1 == 0 → new candidate1 = num, count1=1
 * - Else if count2 == 0 → new candidate2 = num, count2=1
 * - Else → both counts-- (this num "cancels" one of each candidate)
 *
 * After first pass: candidates1 and candidate2 are the ONLY POSSIBLE answers.
 * SECOND PASS: verify each actually appears > n/3 times.
 *
 * WHY SECOND PASS? Boyer-Moore finds candidates, not guarantees.
 * E.g., [1,2,3] has no majority but candidates might be 1 and 2.
 *
 * DRY RUN: nums=[1,1,1,3,3,2,2,2]
 *       cand1  cnt1  cand2  cnt2
 * 1:     1      1     -     0
 * 1:     1      2     -     0
 * 1:     1      3     -     0
 * 3:     1      3     3     1
 * 3:     1      3     3     2
 * 2:     1      2     3     1   (neither cand; cnt1=3-1=2, cnt2=2-1=1? No:
 *        neither is 2, both counts > 0 → cnt1--, cnt2--)
 *        After: cnt1=2, cnt2=1
 * 2:     neither matches, cnt1=1, cnt2=0
 * 2:     cand2=2, cnt2=1
 * Candidates: 1, 2. Verify: 1 appears 3 times (>8/3≈2.67✓), 2 appears 3 times ✓
 * Result: [1, 2] ✓
 *
 * Time:  O(N)
 * Space: O(1)
 */
const majorityElement = (nums) => {
  const n = nums.length;
  let cand1 = null, cnt1 = 0;
  let cand2 = null, cnt2 = 0;

  // Phase 1: Find candidates
  for (const num of nums) {
    if (num === cand1)       cnt1++;
    else if (num === cand2)  cnt2++;
    else if (cnt1 === 0)   { cand1 = num; cnt1 = 1; }
    else if (cnt2 === 0)   { cand2 = num; cnt2 = 1; }
    else { cnt1--; cnt2--; } // num cancels both candidates
  }

  // Phase 2: Verify candidates actually appear > n/3 times
  cnt1 = 0; cnt2 = 0;
  for (const num of nums) {
    if (num === cand1) cnt1++;
    else if (num === cand2) cnt2++;
  }

  const result = [];
  if (cnt1 > Math.floor(n / 3)) result.push(cand1);
  if (cnt2 > Math.floor(n / 3)) result.push(cand2);
  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Majority Element II Tests ===\n");

console.log("Test 1:", majorityElement([3, 2, 3]));             // Expected: [3]
console.log("Test 2:", majorityElement([1, 2]));                // Expected: [1, 2]
console.log("Test 3:", majorityElement([1, 1, 1, 3, 3, 2, 2, 2])); // Expected: [1, 2]
console.log("Test 4:", majorityElement([1, 2, 3]));             // Expected: [] (none > n/3)

module.exports = { majorityElement };
