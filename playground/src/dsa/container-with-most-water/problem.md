# Container With Most Water (LeetCode #11)

You are given an integer array height of length n. There are n vertical
lines drawn such that the two endpoints of the ith line are (i, 0) and
(i, height[i]).

Find two lines that together with the x-axis form a container, such that
the container contains the most water.

Return the maximum amount of water a container can store.

Note: You may not slant the container.

Example 1:

```text
    |         |
    |         |     |
    |         |     |
    |   |     |     |
    |   |  |  |     |
    |   |  |  |  |  |
    |   |  |  |  |  |
  | |   |  |  |  |  |  |
  |_|___|__|__|__|__|__|_|
  1 8 6 2 5 4 8 3 7
        ^-----------^
        max area = 49
```

Input: height = [1,8,6,2,5,4,8,3,7]
Output: 49
Explanation: The max area is between index 1 (height 8) and index 8
```text
             (height 7). Area = min(8,7) * (8-1) = 7 * 7 = 49
```

Example 2:
Input: height = [1,1]
Output: 1

Constraints:
- n == height.length
- 2 <= n <= 10^5
- 0 <= height[i] <= 10^4

Approach: Two Pointers (start from both ends, move shorter wall inward)
Time Complexity: O(n) - single pass through array
Space Complexity: O(1) - only pointers and max variable
