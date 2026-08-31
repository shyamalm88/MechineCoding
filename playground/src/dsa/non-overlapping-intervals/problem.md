# Non-overlapping Intervals (LeetCode #435)

Given an array of intervals intervals where intervals[i] = [starti, endi],
return the minimum number of intervals you need to remove to make the rest
of the intervals non-overlapping.

Example 1:
Input: intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Explanation: [1,3] can be removed and the rest of the intervals are non-overlapping.

Example 2:
Input: intervals = [[1,2],[1,2],[1,2]]
Output: 2
Explanation: You need to remove two [1,2] to make the rest of the intervals non-overlapping.

Constraints:
- 1 <= intervals.length <= 10^5
- intervals[i].length == 2

## Approach

Greedy (Sort by End Time)

## Intuition

To maximize the number of non-overlapping intervals we can keep (which minimizes
the number we remove), we should always pick the interval that ends *earliest*.
Why? Because finishing early leaves the most room for subsequent intervals.

1. Sort by End Time.
2. Iterate: If current interval starts before the previous one ends, it's an overlap.
```text
   We discard the current one (count++) because the previous one ended earlier (greedy choice).
```

Time Complexity: O(N log N)
Space Complexity: O(log N) or O(N) depending on sort implementation.
