# 3Sum Closest (LeetCode #16)

Given an integer array nums and an integer target, find three integers in
nums such that their sum is CLOSEST to target. Return that sum.
Assume exactly one solution exists.

Example 1:
Input: nums=[-1,2,1,-4], target=1 → Output: 2  (-1+2+1=2, closest to 1)

Example 2:
Input: nums=[0,0,0], target=1 → Output: 0

Constraints:
- 3 <= nums.length <= 500
- -1000 <= nums[i] <= 1000
- -10^4 <= target <= 10^4

## Approach

Sort + Two Pointers (extension of 3Sum)

## Story / intuition

Same setup as 3Sum (#15): fix one element, then two-pointer for the other two.
Instead of looking for sum==0, track the sum CLOSEST to target so far.
At each step: if sum < target → move left right (need bigger sum).
```text
             if sum > target → move right left (need smaller sum).
             if sum == target → can't get closer, return immediately.
```

## Dry run

nums=[-4,-1,1,2] (sorted), target=1
i=0 (-4): l=1(-1), r=3(2): sum=-4-1+2=-3. diff=4. closest=-3. -3<1 → l++
```text
          l=2(1), r=3(2): sum=-4+1+2=-1. diff=2. closest=-1. -1<1 → l++
          l>=r. next i.
```

i=1 (-1): l=2(1), r=3(2): sum=-1+1+2=2. diff=1. closest=2. 2>1 → r--
```text
          l>=r. next i.
```

i=2 (1):  l=3(2), r=3(2): l>=r. done.
Result: 2 ✓

Time:  O(N²)
Space: O(1)
