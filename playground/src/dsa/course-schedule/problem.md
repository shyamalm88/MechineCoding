# Course Schedule (LeetCode #207)

> Course Schedule (LeetCode #207)

There are a total of numCourses courses you have to take, labeled from
0 to numCourses - 1. You are given an array prerequisites where
prerequisites[i] = [ai, bi] indicates that you must take course bi
first if you want to take course ai.

Return true if you can finish all courses. Otherwise, return false.

Example 1:

```text
  0 --> 1
```

Input: numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: Take course 0 first, then course 1.

Example 2:

```text
  0 --> 1
  ^     |
  |_____|
```

Input: numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: Course 0 requires 1, but 1 requires 0. Cycle = impossible!

Example 3:

```text
  0 --> 1 --> 2
        |
        v
        3
```

Input: numCourses = 4, prerequisites = [[1,0],[2,1],[3,1]]
Output: true
Explanation: 0 -> 1 -> 2 and 0 -> 1 -> 3

Constraints:
- 1 <= numCourses <= 2000
- 0 <= prerequisites.length <= 5000
- prerequisites[i].length == 2
- 0 <= ai, bi < numCourses
- All pairs [ai, bi] are distinct

## Intuition

Cycle Detection in Directed Graph (3-State DFS)

Core Insight:
- This is a DIRECTED graph (prerequisites have direction)
- Can finish all courses = No cycles in the graph
- Different from undirected cycle detection!

Why 3 states instead of 2?

```text
       0 --> 1 --> 2
             |
             v
             3
```

With 2 states (visited/unvisited):
- DFS from 0: visits 1, 2, 3 (marks all visited)
- If we later check 1, it's "visited" but NOT a cycle!

3-State System:
- 0 = UNVISITED: Haven't seen this node yet
- 1 = VISITING: Currently in recursion stack (path from start)
- 2 = VISITED: Fully processed, all descendants checked

Cycle Detection:
- If we hit a node with state=1 (VISITING), we found a cycle!
- We're still on the path from that node, so it's a back edge

Algorithm:
1. Build adjacency list (prereq -> courses that need it)
2. DFS from each unvisited node
3. Mark node as VISITING before exploring neighbors
4. If neighbor is VISITING -> CYCLE FOUND
5. Mark node as VISITED after all neighbors explored
6. No cycles = can finish all courses

Time Complexity: O(V + E) - visit each node and edge once
Space Complexity: O(V + E) - adjacency list + recursion stack
