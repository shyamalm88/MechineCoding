# Number of Connected Components in an Undirected Graph (LeetCode #323)

> Number of Connected Components in an Undirected Graph (LeetCode #323)

You have a graph of n nodes. You are given an integer n and an array edges
where edges[i] = [ai, bi] indicates that there is an undirected edge
between nodes ai and bi in the graph.

Return the number of connected components in the graph.

Example 1:

```text
  0 --- 1     3
        |     |
        2     4
```

Input: n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
Explanation: Component 1: {0,1,2}, Component 2: {3,4}

Example 2:

```text
  0 --- 1     3
        |     |
        2 --- 4
```

Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1
Explanation: All nodes are connected in one component.

Example 3:

```text
  0     1     2     3     4
  (all isolated)
```

Input: n = 5, edges = []
Output: 5
Explanation: Each node is its own component.

Constraints:
- 1 <= n <= 2000
- 1 <= edges.length <= 5000
- edges[i].length == 2
- 0 <= ai <= bi < n
- ai != bi
- No duplicate edges

## Intuition

DFS to Count Connected Components

Core Idea:
- A connected component = a group of nodes where you can reach any node
```text
  from any other node in the group
```

- If graph is disconnected, there are multiple components

Algorithm:
1. Build adjacency list from edge list
2. Keep visited array to track which nodes we've seen
3. For each unvisited node:
```text
   a. Increment component count (new component found!)
   b. DFS to mark all nodes in this component as visited
```

4. Return total component count

Why this works:
- DFS from any node visits ALL nodes reachable from it
- After DFS, all nodes in that component are marked visited
- Next unvisited node must be in a DIFFERENT component

Visual:

```text
  0 -- 1    3 -- 4
       |
       2
```

```text
  DFS from 0: visits 0 -> 1 -> 2 (marks all visited)
  Node 3 unvisited? New component! DFS from 3: visits 3 -> 4
  Total: 2 components
```

Time Complexity: O(V + E) - build graph + visit each node and edge once
Space Complexity: O(V + E) - adjacency list + visited array + recursion stack
