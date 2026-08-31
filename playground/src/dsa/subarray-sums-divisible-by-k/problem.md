# Subarray Sums Divisible by K (LeetCode #974)

Given an integer array nums and an integer k, return the number of
non-empty CONTIGUOUS subarrays that have a sum divisible by k.

Example 1:
Input: nums=[4,5,0,-2,-3,1], k=5 → Output: 7
Explanation: [4,5,0,-2,-3,1], [5], [5,0], [5,0,-2,-3], [0], [0,-2,-3], [-2,-3]

Example 2:
Input: nums=[5], k=9 → Output: 0

Constraints:
- 1 <= nums.length <= 3 * 10^4
- -10^4 <= nums[i] <= 10^4
- 2 <= k <= 10^4

## Approach

Prefix Sum Remainders + HashMap (extends Subarray Sum Equals K)

## Story / intuition

Same backbone as `subArraySumEqualsK.js` (LC560): a subarray sum(i+1..j)
equals prefixSum[j] - prefixSum[i]. For sum(i+1..j) to be DIVISIBLE BY k,
we need (prefixSum[j] - prefixSum[i]) % k === 0, i.e. prefixSum[j] and
prefixSum[i] have the SAME REMAINDER mod k.

So instead of counting exact prefix-sum VALUES (like LC560), we count
prefix-sum REMAINDERS mod k. Every time we see a remainder we've seen
before, every PRIOR index with that same remainder pairs with the current
index to form a subarray divisible by k — add `count[remainder]` to the
running total, then increment `count[remainder]`.

GOTCHA (the genuinely new part vs LC560): in JS, `%` can return a NEGATIVE
remainder for negative dividends (e.g. `-3 % 5 === -3`, not `2`). Normalize
with `((sum % k) + k) % k` so that -3 and 2 are treated as the SAME bucket
mod 5 — otherwise negative-number test cases silently undercount.

Seed `count = {0: 1}` for the "empty prefix" (remainder 0), exactly like
seeding prefix sum 0 in LC560 — it lets a subarray starting at index 0
count correctly.

## Dry run

nums=[4,5,0,-2,-3,1], k=5
count={0:1}, runningSum=0, result=0
num=4:  sum=4,  rem=4 -> count[4]=0, result+=0=0;  count={0:1,4:1}
num=5:  sum=9,  rem=4 -> count[4]=1, result+=1=1;  count={0:1,4:2}
num=0:  sum=9,  rem=4 -> count[4]=2, result+=2=3;  count={0:1,4:3}
num=-2: sum=7,  rem=2 -> count[2]=0, result+=0=3;  count={0:1,4:3,2:1}
num=-3: sum=4,  rem=4 -> count[4]=3, result+=3=6;  count={0:1,4:4,2:1}
num=1:  sum=5,  rem=0 -> count[0]=1, result+=1=7;  count={0:2,4:4,2:1}
Result: 7 ✓

Time:  O(N) — single pass
Space: O(min(N, k)) — at most k distinct remainders
