# Majority Element II (LeetCode #229)

Given an integer array of size n, find all elements that appear MORE THAN ⌊n/3⌋ times.
There can be at most 2 such elements.

Example 1:
Input: nums=[3,2,3] → Output: [3]
Example 2:
Input: nums=[1,2] → Output: [1,2]
Example 3:
Input: nums=[1,1,1,3,3,2,2,2] → Output: [1,2]  (1 appears 3 times, 2 appears 3 times, n/3=2.67)

Constraints:
- 1 <= nums.length <= 5 * 10^4
- -10^9 <= nums[i] <= 10^9

## Approach

Boyer-Moore Voting Algorithm (extended for n/3)

## Story / intuition

CORE IDEA from majority element (#169): A majority element (> n/2) "outvotes"
all others combined. Extend this: at most 2 elements can appear > n/3 times.
So we maintain 2 candidates and 2 counters.

## Voting rules

- If current num == candidate1 → count1++
- Else if current num == candidate2 → count2++
- Else if count1 == 0 → new candidate1 = num, count1=1
- Else if count2 == 0 → new candidate2 = num, count2=1
- Else → both counts-- (this num "cancels" one of each candidate)

After first pass: candidates1 and candidate2 are the ONLY POSSIBLE answers.

## Second pass

verify each actually appears > n/3 times.

WHY SECOND PASS? Boyer-Moore finds candidates, not guarantees.
E.g., [1,2,3] has no majority but candidates might be 1 and 2.

## Dry run

nums=[1,1,1,3,3,2,2,2]
```text
      cand1  cnt1  cand2  cnt2
```

1:     1      1     -     0
1:     1      2     -     0
1:     1      3     -     0
3:     1      3     3     1
3:     1      3     3     2
2:     1      2     3     1   (neither cand; cnt1=3-1=2, cnt2=2-1=1? No:
```text
       neither is 2, both counts > 0 → cnt1--, cnt2--)
       After: cnt1=2, cnt2=1
```

2:     neither matches, cnt1=1, cnt2=0
2:     cand2=2, cnt2=1
Candidates: 1, 2. Verify: 1 appears 3 times (>8/3≈2.67✓), 2 appears 3 times ✓
Result: [1, 2] ✓

Time:  O(N)
Space: O(1)
