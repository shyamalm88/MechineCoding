# Interval List Intersections (LeetCode #986)

Given two lists of closed intervals firstList and secondList (both sorted,
disjoint within each list), return the intersection of these two lists.

Example 1:
Input: firstList=[[0,2],[5,10],[13,23],[24,25]]
```text
       secondList=[[1,5],[8,12],[15,24],[25,26]]
```

Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]

Example 2:
Input: firstList=[[1,3],[5,9]], secondList=[]
Output: []

Constraints:
- 0 <= firstList.length, secondList.length <= 1000
- firstList[i].length == secondList[j].length == 2
- 0 <= start_i < end_i <= 10^9
