# Trapping Rain Water (LeetCode #42)

Given n non-negative integers representing an elevation map where the
width of each bar is 1, compute how much water it can trap after raining.

Example 1:

```text
            |
    |       || |
    |~|   |~||~||~|
  |~||~|  ||~||~||||
  |||||||||||||||||
  0 1 0 2 1 0 1 3 2 1 2 1
```

Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black bars) is represented by the
```text
             array. The trapped water (blue ~) is 6 units.
```

Example 2:
Input: height = [4,2,0,3,2,5]
Output: 9

Constraints:
- n == height.length
- 1 <= n <= 2 * 10^4
- 0 <= height[i] <= 10^5

Key Insight:
Water at position i = min(leftMax, rightMax) - height[i]
We don't need to know both maxes; we only need to know
the smaller one to determine the water level.

Approach: Two Pointers with running max
Time Complexity: O(n) - single pass through array
Space Complexity: O(1) - only pointers and max variables

## Alternative solution

Prefix/Suffix Max Arrays
