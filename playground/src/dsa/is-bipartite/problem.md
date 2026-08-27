# Is Graph Bipartite? (LeetCode #785)

There is an undirected graph with n nodes, where each node is numbered
between 0 and n - 1. You are given a 2D array graph, where graph[u] is
an array of nodes that node u is adjacent to.

A graph is bipartite if the nodes can be partitioned into two independent
sets A and B such that every edge in the graph connects a node in set A
and a node in set B.

Return true if and only if the graph is bipartite.

Example 1:

```text
    0 ---- 1
    |      |
    |      |
    3 ---- 2
```

Input: graph = [[1,3],[0,2],[1,3],[0,2]]
Output: true
Explanation: Can split into A = {0, 2} and B = {1, 3}
```text
             Every edge connects A to B.
```

Example 2:

```text
    0 ---- 1
    | \    |
    |  \   |
    3 ---- 2
```

Input: graph = [[1,2,3],[0,2],[0,1,3],[0,2]]
Output: false
Explanation: Cannot partition. Node 0 connects to 1, 2, 3.
```text
             If 0 is in A, then 1, 2, 3 must be in B.
             But 1-2 edge means both 1 and 2 in B... invalid!
```

Constraints:
- graph.length == n
- 1 <= n <= 100
- 0 <= graph[u].length < n
- 0 <= graph[u][i] <= n - 1
- graph[u] does not contain u (no self-loops)
- graph[u][i] != graph[u][j] for all i != j (no duplicate edges)
- If graph[u] contains v, then graph[v] contains u (undirected)

## Intuition

Two-Coloring with DFS

Bipartite = Two-Colorable!

Key Insight:
- A graph is bipartite if and only if we can color all nodes with 2 colors
```text
  such that no two adjacent nodes have the same color
```

- This is equivalent to: graph has NO odd-length cycles

Algorithm (2-Coloring with DFS):
1. Use colors: -1 (unvisited), 0 (group A), 1 (group B)
2. Start DFS from any unvisited node, assign color 0
3. For each neighbor:
```text
   a. If same color as current node -> NOT bipartite (conflict!)
   b. If uncolored, assign opposite color and continue DFS
   c. If different color, OK (already correctly colored)
```

4. Graph may be disconnected, so check all components

Visual (2-Coloring):

```text
    0(A) ---- 1(B)
      |        |
      |        |
    3(B) ---- 2(A)
```

```text
  Color 0 as A (0)
  Neighbors 1, 3 must be B (1)
  Neighbor of 1 is 2, must be A (0)
  Check: 2's neighbor 3 is B (1) - OK!
  Bipartite!
```

Why check if neighbor has SAME color?
- If we're at node X with color C, all neighbors should have color (1-C)
- If a neighbor already has color C -> edge within same group -> NOT bipartite

Time Complexity: O(V + E) - visit each node and edge once
Space Complexity: O(V) - color array + recursion stack
