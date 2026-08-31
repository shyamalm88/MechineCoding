# 4Sum (LeetCode #18)

Given an array nums of n integers, return an array of all the unique
quadruplets [nums[a], nums[b], nums[c], nums[d]] such that:
- 0 <= a, b, c, d < n, all distinct
- nums[a] + nums[b] + nums[c] + nums[d] == target

The solution set must not contain duplicate quadruplets.

Example 1:
Input: nums = [1,0,-1,0,-2,2], target = 0
Output: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]

Example 2:
Input: nums = [2,2,2,2,2], target = 8
Output: [[2,2,2,2]]

Constraints:
- 1 <= nums.length <= 200
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9

## Approach

Sort + Two Fixed Loops + Two Pointers (kSum reduction)

## Story / intuition

Same ladder as 3Sum, one rung higher. 3Sum fixes ONE number and reduces to
"two sum" with two pointers. 4Sum fixes TWO numbers (nested loops i, j) and
reduces to that SAME "two sum" two-pointer search for the remaining pair.

Sort first so:
 - duplicates land next to each other (skip them at every level: i, j,
```text
   left, right) to avoid duplicate quadruplets.
```

 - the two-pointer convergence is meaningful (sum increases with `left++`,
```text
   decreases with `right--`).
```

DRY RUN (sorted nums=[-2,-1,0,0,1,2], target=0):
i=0(-2): j=1(-1): left=2(0), right=5(2): sum=-1 < 0 → left++
```text
                   left=3(0), right=5(2): sum=-1 < 0 → left++
                   left=4(1), right=5(2): sum=0 ✓  → [-2,-1,1,2]
         j=2(0):  left=3(0), right=5(2): sum=0 ✓  → [-2,0,0,2]
         j=3(0): skip (duplicate of j=2)
```

i=1(-1): j=2(0):  left=3(0), right=5(2): sum=1 > 0 → right--
```text
                   left=3(0), right=4(1): sum=0 ✓  → [-1,0,0,1]
```

Result: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]] ✓

Time:  O(N^3) - two nested loops + one two-pointer scan
Space: O(1) extra (ignoring output / sort space)
