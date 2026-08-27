/**
 * PROBLEM: Majority Element (LeetCode #169)
 *
 * Return the element appearing more than ⌊n/2⌋ times. One is guaranteed to exist.
 *
 * INTUITION:
 * A hash map is O(n) time and O(n) space. The expected answer is
 * BOYER-MOORE VOTING, which is O(1) space:
 *
 *   keep a candidate and a count; a matching element votes +1, any other votes
 *   -1; when the count hits 0, adopt the current element as the new candidate.
 *
 * Why it works: the true majority occurs more than all others COMBINED, so
 * every cancellation removes one majority and one non-majority element. The
 * majority cannot be exhausted first, so it survives as the final candidate.
 *
 * DRY RUN: [2,2,1,1,1,2,2]
 *   2(c=1) 2(c=2) 1(c=1) 1(c=0) 1→candidate=1(c=1) 2(c=0) 2→candidate=2(c=1)
 *   answer 2
 *
 * NOTE: without the guarantee you must verify the candidate in a second pass --
 * the algorithm always returns something, even when no majority exists.
 *
 * TIME: O(n)   SPACE: O(1)
 */
const majorityElement = (nums) => {
  let candidate = null;
  let count = 0;
  for (const n of nums) {
    if (count === 0) candidate = n;
    count += n === candidate ? 1 : -1;
  }
  return candidate;
};

console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
