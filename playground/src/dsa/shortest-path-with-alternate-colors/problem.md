# Shortest Path with Alternating Colors (LeetCode #1129)

## Category

🟢 IMPORTANT (Graph BFS with Color-State)

You are given a directed graph with n nodes (0 to n - 1).

There are two types of edges:
- redEdges
- blueEdges

You want to find the shortest path from node 0 to every other node
such that the colors of edges used ALTERNATE at every step.

Return an array answer where:
```text
  answer[i] = length of the shortest alternating path from 0 to i,
              or -1 if no such path exists.
```

Example:

```text
  n = 3
  redEdges  = [[0,1],[1,2]]
  blueEdges = []
```

```text
  Output: [0, 1, -1]
```

```text
  Explanation:
  - 0 → 1 via red (valid)
  - 0 → 1 → 2 would require blue after red, but no blue edge exists
```

Constraints:
- 1 <= n <= 100
- 0 <= redEdges.length, blueEdges.length <= 400

## Intuition

Why Normal BFS Fails

This looks like a shortest path problem → BFS?

The twist:
- The validity of a path depends on the COLOR of the previous edge

Key Insight (VERY IMPORTANT):

```text
  Reaching the SAME node with DIFFERENT last-edge colors
  are DIFFERENT STATES.
```

So:
```text
  (node = 2, lastColor = red)  ≠  (node = 2, lastColor = blue)
```

A simple visited[node] is WRONG.

STATE MODELING

State = (currentNode, lastEdgeColor)

lastEdgeColor ∈ {RED, BLUE}

At the start:
- We have not taken any edge yet
- So we can conceptually start with BOTH colors allowed

ALGORITHM (BFS with Color State)

1. Build adjacency lists:
```text
     redGraph[u]  = list of nodes reachable via red edges
     blueGraph[u] = list of nodes reachable via blue edges
```

2. distance[node][color]:
```text
     shortest distance to reach node where the last edge used was `color`
```

3. Initialize:
```text
     distance[0][RED]  = 0
     distance[0][BLUE] = 0
```

4. BFS queue stores:
```text
     [node, lastColor]
```

5. From current state:
```text
     - If lastColor == RED:
          → next edges must be BLUE
     - If lastColor == BLUE:
          → next edges must be RED
```

6. Take minimum distance over both colors for each node

TIME & SPACE COMPLEXITY

Let:
- V = number of nodes
- E = total edges

Time:  O(V + E)
Space: O(V + E)

WHY THIS PROBLEM IS 🟢 IMPORTANT

Interviewers are checking:
- Can you model state beyond just the node?
- Do you understand layered BFS?
- Can you reason about constraints affecting transitions?

This problem is a CLEAN introduction to state-based graph traversal.
