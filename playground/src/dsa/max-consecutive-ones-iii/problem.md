# Max Consecutive Ones III (LeetCode #1004)

Given a binary array nums and an integer k, return the maximum number of
consecutive 1s if you can flip at most k 0s.

Example 1:
Input: nums=[1,1,1,0,0,0,1,1,1,1,0], k=2
Output: 6  (flip 0s at index 5 and 10)

Example 2:
Input: nums=[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,0], k=3
Output: 10

Constraints:
- 1 <= nums.length <= 10^5
- nums[i] is 0 or 1
- 0 <= k <= nums.length

## Approach

Sliding Window — "at most K zeros" in window

## Story / intuition

The window represents a segment we're "considering flipping". We allow up to
K zeros inside it (they represent the flips we use). When zeros > K, the
window has too many 0s to flip — shrink from left until zeros == K again.

At every step, the window [left, right] is a valid segment (zeros <= K).
Track max window size.

## Pattern note

This exact template solves many problems:
"Longest subarray / substring with at most K bad elements"

DRY RUN (nums=[1,1,0,0,1,1], k=1):
r=0(1): zeros=0, win=1
r=1(1): zeros=0, win=2
r=2(0): zeros=1, win=3  ← used 1 flip
r=3(0): zeros=2 > k! Shrink left: l=0(1), zeros still 2. l=1(1), still 2. l=2(0), zeros=1. l=3.
```text
        window=[3..3], win=1
```

r=4(1): zeros=1, win=2
r=5(1): zeros=1, win=3
Result: 3

Time:  O(N)
Space: O(1)
