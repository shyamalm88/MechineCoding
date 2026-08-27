# Boats to Save People (LeetCode #881)

> Boats to Save People (LeetCode #881)

Each boat can carry at most 2 people, with weight limit `limit`.
Given people[] (their weights), return the minimum number of boats needed.

Example 1:
Input: people=[1,2], limit=3 → Output: 1  (both on one boat)

Example 2:
Input: people=[3,2,2,1], limit=3 → Output: 3  ([3],[2,1],[2])

Example 3:
Input: people=[3,5,3,4], limit=5 → Output: 4  ([3],[5],[3],[4]? No: [3,2]? no limit=5)
```text
  Actually: [3+2 no, limit 5] → [5],[4],[3,1]→ but we don't have 1... wait
  people=[3,5,3,4], limit=5: sort=[3,3,4,5], [3+2?] no → [3,?] 3+3>5 no → [3 alone],[3 alone],[4 alone],[5 alone] → 4? No: [5 alone],[4 alone],[3 alone],[3 alone]=4 or [5],[3,? 3+3>5 no],[4? no],[3] → 4
```

Constraints:
- 1 <= people.length <= 5 * 10^4
- 1 <= people[i] <= limit <= 3 * 10^4
