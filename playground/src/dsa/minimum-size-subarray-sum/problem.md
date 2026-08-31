# Minimum Size Subarray Sum (LeetCode #209)

Given an array of positive integers nums and a positive integer target,
return the minimal length of a subarray whose sum >= target.
If there is no such subarray, return 0.

Example 1:
Input: target=7, nums=[2,3,1,2,4,3]
Output: 2  ([4,3])

Example 2:
Input: target=4, nums=[1,4,4]
Output: 1  ([4])

Constraints:
- 1 <= target <= 10^9
- 1 <= nums[i] <= 10^4
- 1 <= nums.length <= 10^5

## Approach

Variable-Size Sliding Window

## Story / intuition

Expand the right edge until the window sum >= target (valid window found).
Then shrink the left edge as much as possible while sum stays >= target
to minimize window length. Record the minimum each time we're valid.

Why not fixed window? We don't know the length upfront. So we grow freely
and shrink greedily.

DRY RUN (target=7, nums=[2,3,1,2,4,3]):
r=0: sum=2  → not valid
r=1: sum=5  → not valid
r=2: sum=6  → not valid
r=3: sum=8  → VALID! len=4. Shrink: remove 2 → sum=6 < 7. Stop.
r=4: sum=10 → VALID! len=4. Shrink: remove 3 → sum=7 >= 7. len=3. Shrink: remove 1 → sum=6. Stop.
r=5: sum=9  → VALID! len=3. Shrink: remove 2 → sum=7 >= 7. len=2! Shrink: remove 4 → sum=3. Stop.
Result: 2

Time:  O(N) — each element enters and leaves the window at most once
Space: O(1)
