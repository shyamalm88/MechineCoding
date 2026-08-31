# Two Sum (LeetCode #1)

Given an array of integers nums and an integer target, return indices of the
two numbers that add up to target. Each input has exactly one solution.
You may not use the same element twice.

Example 1:
Input: nums=[2,7,11,15], target=9 → Output: [0,1]

Example 2:
Input: nums=[3,2,4], target=6 → Output: [1,2]

Example 3:
Input: nums=[3,3], target=6 → Output: [0,1]

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- Exactly one valid answer

## Approach

HashMap — One Pass

## Story / intuition

As we walk through the array, for each number we ask:
"Have I seen the number that would complete my pair (target - current)?"
The HashMap acts as memory — it tells us in O(1) if we've seen the complement.

## Key

We store { value → index } so we can return both indices.
We check BEFORE adding to the map (handles the same-element-used-twice constraint).

## Dry run

nums=[3,2,4], target=6
i=0, num=3: complement=3. Map has 3? No. Add {3:0}.
i=1, num=2: complement=4. Map has 4? No. Add {3:0, 2:1}.
i=2, num=4: complement=2. Map has 2? YES at index 1. Return [1,2] ✓

Time:  O(N)
Space: O(N)
