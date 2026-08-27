# Clone Graph (LeetCode #133)

> Clone Graph (LeetCode #133)

Given a reference of a node in a connected undirected graph, return a
deep copy (clone) of the graph.

Each node in the graph contains:
```text
  - val (int): The node's value
  - neighbors (Node[]): A list of its neighbors
```

Test case format:
The graph is represented as an adjacency list where index = node value.
Each node in the graph has a unique value (1, 2, 3, ..., n).

Example 1:

```text
     1 ---- 2
     |      |
     |      |
     4 ---- 3
```

Input: adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: Node 1 connects to 2 and 4
```text
             Node 2 connects to 1 and 3
             Node 3 connects to 2 and 4
             Node 4 connects to 1 and 3
```

Example 2:
Input: adjList = [[]]
Output: [[]]
Explanation: One node with no neighbors

Example 3:
Input: adjList = []
Output: []
Explanation: Empty graph

Constraints:
- Number of nodes: [0, 100]
- 1 <= Node.val <= 100
- Node.val is unique for each node
- No repeated edges or self-loops
- Graph is connected (all nodes reachable from given node)

## Intuition

DFS with HashMap (Clone as you traverse)

Why use a HashMap?
- We need to track which nodes we've already cloned
- Map: original node -> cloned node
- Prevents infinite loops (graph has cycles!)
- Ensures same node isn't cloned twice

Algorithm:
1. If node is null, return null
2. If node already cloned (in map), return the clone
3. Create clone of current node
4. Store in map BEFORE recursing (handles cycles!)
5. Recursively clone all neighbors
6. Return the clone

Key Insight:
- We MUST add to map BEFORE processing neighbors
- Otherwise, cycles will cause infinite recursion

```text
  Original: 1 <-> 2    When cloning 1:
                       1. Clone node 1, add to map
                       2. Clone neighbor 2
                       3. Clone neighbor 1 of 2 -> found in map! Return clone.
```

Time Complexity: O(N + E) - visit each node and edge once
Space Complexity: O(N) - HashMap stores N nodes + recursion stack
