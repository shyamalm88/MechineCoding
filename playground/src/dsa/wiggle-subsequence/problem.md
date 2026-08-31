# Wiggle Subsequence (LeetCode #376)

A wiggle sequence is one where the differences between successive numbers
strictly alternate between positive and negative. A sequence of one element,
and any two unequal elements, are trivially wiggle sequences.

Given an integer array nums, return the length of the LONGEST wiggle
SUBSEQUENCE (elements may be deleted; order is preserved).

Example 1:
Input: nums = [1,7,4,9,2,5] → Output: 6
(The whole array already wiggles: +6,-3,+5,-7,+3)

Example 2:
Input: nums = [1,17,5,10,13,15,10,5,16,8] → Output: 7
(One choice: [1,17,10,13,10,16,8])

Constraints:
- 1 <= nums.length <= 1000
- 0 <= nums[i] <= 1000

## Approach

Greedy — Count Direction Changes (Two Rolling States)

## Story / intuition

Picture the array as a mountain range. A wiggle subsequence is just the list
of PEAKS and VALLEYS — every point strictly between a peak and a valley lies
on a monotone slope and adds nothing, because keeping it would force two
consecutive differences of the same sign.

So the answer is simply "how many times does the direction change, plus 1".
Track two rolling values:
```text
  up   = longest wiggle so far that ENDS with a rise
  down = longest wiggle so far that ENDS with a fall
```

On a rise, the best you can do is extend the best "ends with a fall" chain:
```text
  up = down + 1.  Symmetrically, on a fall: down = up + 1.
```

Equal neighbours change nothing — a zero difference is neither direction, so
both states carry forward untouched. That is what makes duplicates safe.

## Why the greedy choice is safe

Along a monotone run you should always keep the EXTREME element (the highest
of a rising run, the lowest of a falling run). Keeping the extreme is never
worse: it leaves the widest possible gap for the next move in the opposite
direction, so any continuation valid for an interior point is also valid for
the extreme. The up/down recurrence is exactly this rule in O(1) space.

## Dry run

[1,17,5,10,13,15,10,5,16,8]
 i=1 (1→17)  rise  up = down+1 = 2
 i=2 (17→5)  fall  down = up+1 = 3
 i=3 (5→10)  rise  up = down+1 = 4
 i=4 (10→13) rise  up = down+1 = 4   (no change — still one slope)
 i=5 (13→15) rise  up = 4
 i=6 (15→10) fall  down = up+1 = 5
 i=7 (10→5)  fall  down = 5
 i=8 (5→16)  rise  up = down+1 = 6
 i=9 (16→8)  fall  down = up+1 = 7
 max(6,7) = 7

Time:  O(N) — single pass
Space: O(1) — two integers
