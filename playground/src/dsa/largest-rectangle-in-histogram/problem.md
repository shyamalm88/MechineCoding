# Largest Rectangle in Histogram (LeetCode #84)

Given an array of integers `heights` representing the histogram's bar
heights, where each bar has width 1, return the area of the largest
rectangle that can be formed within the histogram.

Example 1:

```text
          ___
     ___ |   |
    |   ||   |___
```

 ___|   ||   |   |___
|   |   ||   |   |   |
| 2 | 1 | 5 | 6 | 2 | 3 |

Input: heights = [2,1,5,6,2,3]
Output: 10
Explanation: The shaded rectangle (bars at index 2-3, height 5) has area
```text
             5 * 2 = 10.
```

Example 2:
Input: heights = [2,4]
Output: 4

Constraints:
- 1 <= heights.length <= 10^5
- 0 <= heights[i] <= 10^4
