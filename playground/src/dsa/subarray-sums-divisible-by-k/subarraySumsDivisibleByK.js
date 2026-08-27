// ============================================================================
// APPROACH: Prefix Sum Remainders + HashMap (extends Subarray Sum Equals K)
// ============================================================================
/**
 * STORY / INTUITION:
 * Same backbone as `subArraySumEqualsK.js` (LC560): a subarray sum(i+1..j)
 * equals prefixSum[j] - prefixSum[i]. For sum(i+1..j) to be DIVISIBLE BY k,
 * we need (prefixSum[j] - prefixSum[i]) % k === 0, i.e. prefixSum[j] and
 * prefixSum[i] have the SAME REMAINDER mod k.
 *
 * So instead of counting exact prefix-sum VALUES (like LC560), we count
 * prefix-sum REMAINDERS mod k. Every time we see a remainder we've seen
 * before, every PRIOR index with that same remainder pairs with the current
 * index to form a subarray divisible by k — add `count[remainder]` to the
 * running total, then increment `count[remainder]`.
 *
 * GOTCHA (the genuinely new part vs LC560): in JS, `%` can return a NEGATIVE
 * remainder for negative dividends (e.g. `-3 % 5 === -3`, not `2`). Normalize
 * with `((sum % k) + k) % k` so that -3 and 2 are treated as the SAME bucket
 * mod 5 — otherwise negative-number test cases silently undercount.
 *
 * Seed `count = {0: 1}` for the "empty prefix" (remainder 0), exactly like
 * seeding prefix sum 0 in LC560 — it lets a subarray starting at index 0
 * count correctly.
 *
 * DRY RUN: nums=[4,5,0,-2,-3,1], k=5
 * count={0:1}, runningSum=0, result=0
 * num=4:  sum=4,  rem=4 -> count[4]=0, result+=0=0;  count={0:1,4:1}
 * num=5:  sum=9,  rem=4 -> count[4]=1, result+=1=1;  count={0:1,4:2}
 * num=0:  sum=9,  rem=4 -> count[4]=2, result+=2=3;  count={0:1,4:3}
 * num=-2: sum=7,  rem=2 -> count[2]=0, result+=0=3;  count={0:1,4:3,2:1}
 * num=-3: sum=4,  rem=4 -> count[4]=3, result+=3=6;  count={0:1,4:4,2:1}
 * num=1:  sum=5,  rem=0 -> count[0]=1, result+=1=7;  count={0:2,4:4,2:1}
 * Result: 7 ✓
 *
 * Time:  O(N) — single pass
 * Space: O(min(N, k)) — at most k distinct remainders
 */
const subarraysDivByK = (nums, k) => {
  const remainderCount = new Map([[0, 1]]);
  let runningSum = 0;
  let result = 0;

  for (const num of nums) {
    runningSum += num;
    const remainder = ((runningSum % k) + k) % k; // normalize negative remainders

    result += remainderCount.get(remainder) || 0;
    remainderCount.set(remainder, (remainderCount.get(remainder) || 0) + 1);
  }

  return result;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Subarray Sums Divisible by K Tests ===\n");

console.log("Test 1:", subarraysDivByK([4, 5, 0, -2, -3, 1], 5)); // Expected: 7
console.log("Test 2:", subarraysDivByK([5], 9)); // Expected: 0
console.log("Test 3:", subarraysDivByK([-1, -1, 1], 2)); // Expected: 2 ([-1,-1] and [-1,1])

module.exports = { subarraysDivByK };
