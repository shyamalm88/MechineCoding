# Shortest Subarray with Sum at Least K (LeetCode #862)

Given an integer array nums and an integer k, return the length of the
shortest non-empty subarray of nums with a sum of at least k.
If there is no such subarray, return -1.

## Important

nums can contain NEGATIVE numbers — that's what makes this
harder than Minimum Size Subarray Sum (LC209), where every number is
positive and a plain expand/shrink two-pointer works.

Example 1:
Input: nums = [1], k = 1
Output: 1

Example 2:
Input: nums = [1,2], k = 4
Output: -1

Example 3:
Input: nums = [2,-1,2], k = 3
Output: 3

Constraints:
- 1 <= nums.length <= 10^5
- -10^5 <= nums[i] <= 10^5
- 1 <= k <= 10^9

## Approach

Prefix Sums + Monotonic Increasing Deque of indices

## Story / intuition

With negative numbers, a normal sliding window breaks: growing the window
doesn't monotonically grow the sum, so "shrink while sum >= k" no longer
makes sense. The fix is to work with PREFIX SUMS instead of raw values.

prefix[j] - prefix[i] = sum(nums[i..j-1])

We want the SHORTEST (j - i) such that prefix[j] - prefix[i] >= k, i.e.
prefix[i] <= prefix[j] - k. For a fixed j, we want the LARGEST valid i
(closest to j) — that gives the shortest length.

Keep a deque of indices whose prefix sums are STRICTLY INCREASING:

- Before pushing index j, pop any index from the BACK whose prefix sum
```text
  is >= prefix[j]. Those indices are now USELESS — j is both closer
  (shorter subarray) AND has a smaller-or-equal prefix sum (easier to
  satisfy "prefix[i] <= prefix[j] - k" for future j's). This keeps the
  deque monotonically increasing in prefix-sum value.
```

- While the FRONT of the deque satisfies prefix[j] - prefix[front] >= k,
```text
  we found a valid subarray (front..j). Record its length and pop the
  front — once consumed by this j, an EARLIER j' < j would only give a
  longer subarray with the same front, so the front is useless going
  forward too.
```

## Dry run

nums = [2,-1,2], k = 3
prefix = [0, 2, 1, 3]   (prefix[0]=0, prefix[1]=2, prefix[2]=1, prefix[3]=3)

i=0: deque=[] → push 0           → deque=[0]
i=1 (prefix=2): front check: 2-0=2 < 3, no match.
```text
     back check: prefix[0]=0 >= 2? no → push 1   → deque=[0,1]
```

i=2 (prefix=1): front check: 1-0=1 < 3, no match.
```text
     back check: prefix[1]=2 >= 1? yes → pop 1   → deque=[0]
                 prefix[0]=0 >= 1? no → push 2   → deque=[0,2]
```

i=3 (prefix=3): front check: 3-0=3 >= 3 → result=min(∞,3-0)=3, pop 0 → deque=[2]
```text
                front check again: 3-1=2 < 3, stop.
     back check: prefix[2]=1 >= 3? no → push 3   → deque=[2,3]
```

result = 3 ✓

Time:  O(N) — each index pushed and popped at most once
Space: O(N) — prefix array + deque
