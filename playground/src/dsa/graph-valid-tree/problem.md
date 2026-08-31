# Graph Valid Tree (LeetCode #261)

You are given:
- n nodes labeled from 0 to n - 1
- edges where edges[i] = [u, v] represents an undirected edge

Determine whether these edges form a VALID TREE.

A graph is a valid tree if:
1) It is CONNECTED (all nodes reachable)
2) It has NO CYCLES

CORE GRAPH INSIGHT

For an UNDIRECTED graph with n nodes:

```text
  A valid tree MUST have exactly (n - 1) edges.
```

Why?
- Fewer edges  → graph must be disconnected
- More edges  → at least one cycle must exist

## Important

- edges.length === n - 1 is NECESSARY
- edges.length === n - 1 is NOT sufficient alone

We still must verify:
- No cycles
- Full connectivity

## Approach

DFS (Graph Traversal)

Key idea:
- Use DFS to traverse the graph
- Detect cycles using PARENT tracking
- Ensure all nodes are visited (connectivity)

Why parent tracking?
- In an undirected graph, every edge appears twice
- Revisiting the parent node is NOT a cycle
- Visiting any OTHER already-visited node IS a cycle

ALGORITHM (DFS)

1. If edges.length !== n - 1 → return false immediately

2. Build adjacency list from edges

3. Run DFS starting from node 0:
```text
     - Mark nodes as visited
     - If we encounter a visited node that is NOT the parent → cycle
```

4. After DFS:
```text
     - If visited.size !== n → graph is disconnected
```

5. If no cycles AND all nodes visited → valid tree

TIME & SPACE COMPLEXITY

Time:
```text
  O(n + edges)
```

Space:
```text
  O(n + edges)  (adjacency list + recursion stack)
```

WHY THIS PROBLEM IS 🔵 CORE

Interviewers are testing:
- Understanding of what defines a tree
- Cycle detection in undirected graphs
- Connectivity verification
- Proper use of DFS with parent tracking
