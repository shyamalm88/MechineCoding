# Course Schedule II (LeetCode #210)

> Course Schedule II (LeetCode #210)

There are a total of numCourses courses you have to take, labeled from
0 to numCourses - 1. You are given an array prerequisites where
prerequisites[i] = [ai, bi] indicates that you must take course bi
first if you want to take course ai.

Return the ordering of courses you should take to finish all courses.
If there are many valid answers, return any of them. If it is impossible
to finish all courses, return an empty array.

Example 1:

```text
  0 <-- 1
```

Input: numCourses = 2, prerequisites = [[1,0]]
Output: [0,1]
Explanation: Take course 0, then course 1.

Example 2:

```text
  0 <-- 1
  ^     ^
  |     |
  +--2--+
```

Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,1,2,3] or [0,2,1,3]
Explanation: There are two valid orderings.

Example 3:
Input: numCourses = 1, prerequisites = []
Output: [0]

Constraints:
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= numCourses * (numCourses - 1)
- prerequisites[i].length == 2
- 0 <= ai, bi < numCourses
- ai != bi
- All pairs [ai, bi] are distinct

## Intuition

Topological Sort with DFS (Post-order)

This is Course Schedule I + return the actual order!

Key Insight (Topological Sort):
- A valid course order is a TOPOLOGICAL ORDER of the graph
- Topological order: for every edge u->v, u appears before v
- Only exists if graph has NO CYCLES (DAG - Directed Acyclic Graph)

DFS Approach (Post-order):

```text
     0 --> 1 --> 3
     |           ^
     v           |
     2 ----------+
```

DFS from 0:
- Visit 0, go to 1, go to 3 (done), backtrack
- Add 3 to result (post-order)
- Add 1 to result
- Go to 2, go to 3 (already done)
- Add 2 to result
- Add 0 to result
- Result: [3, 1, 2, 0] -> Reverse: [0, 2, 1, 3]

Why Post-order + Reverse?
- In post-order, we add a node AFTER all its descendants
- So dependencies are added first
- Reversing gives us: prerequisites before dependents

Algorithm:
1. Build adjacency list (prereq -> courses that need it)
2. DFS with 3 states (same as Course Schedule I)
3. Add node to result AFTER processing all neighbors (post-order)
4. Reverse result at the end (or use unshift/prepend)

## Dry run

Input: numCourses = 4, prerequisites = [[1,0], [2,0], [3,1], [3,2]]
Graph (0->1, 0->2, 1->3, 2->3):
```text
  0: [1, 2]
  1: [3]
  2: [3]
  3: []
```

Execution:
- Loop i=0 (Node 0): State 0 (Unvisited) -> Call dfs(0)
```text
  - dfs(0): Mark Visiting (1). Neighbors: [1, 2]
    - Process Neighbor 1: State 0 -> Call dfs(1)
      - dfs(1): Mark Visiting (1). Neighbors: [3]
        - Process Neighbor 3: State 0 -> Call dfs(3)
          - dfs(3): Mark Visiting (1). Neighbors: []
          - dfs(3): Mark Visited (2). Push 3 to result. Result: [3]
      - dfs(1): Mark Visited (2). Push 1 to result. Result: [3, 1]
    - Process Neighbor 2: State 0 -> Call dfs(2)
      - dfs(2): Mark Visiting (1). Neighbors: [3]
        - Process Neighbor 3: State 2 (Visited) -> Skip
      - dfs(2): Mark Visited (2). Push 2 to result. Result: [3, 1, 2]
  - dfs(0): Mark Visited (2). Push 0 to result. Result: [3, 1, 2, 0]
```

- Loop i=1,2,3: All State 2 (Visited) -> Skip

Final Step: Reverse Result -> [0, 2, 1, 3] (Valid Topological Sort)

Time Complexity: O(V + E) - visit each node and edge once
Space Complexity: O(V + E) - adjacency list + result array
