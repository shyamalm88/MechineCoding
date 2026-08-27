# Path With Maximum Probability (LeetCode #1514)

> Path With Maximum Probability (LeetCode #1514)

## Category

🔵 CORE (Dijkstra with Modified Cost Function)

You are given an undirected graph with n nodes (labeled 0 to n - 1).

You are given:
- edges[i] = [a, b]  → an undirected edge between a and b
- succProb[i]        → probability of successfully traversing that edge

You are also given:
- start node
- end node

Return the maximum probability of reaching end from start.
If there is no path, return 0.

Example 1:

```text
  n = 3
  edges = [[0,1],[1,2],[0,2]]
  succProb = [0.5, 0.5, 0.2]
  start = 0, end = 2
```

```text
  Paths:
    0 → 2        → prob = 0.2
    0 → 1 → 2    → prob = 0.5 × 0.5 = 0.25  ✅
```

```text
  Output: 0.25
```

Example 2:

```text
  n = 3
  edges = [[0,1]]
  succProb = [0.5]
  start = 0, end = 2
```

```text
  Output: 0 (no path)
```

Constraints:
- 1 <= n <= 10^4
- 0 <= edges.length <= 2 * 10^4
- 0 <= succProb[i] <= 1
- Undirected graph

## Intuition

Dijkstra Is NOT About "Sum" — It's About Greedy Best-First Expansion

This problem looks different, but it is still Dijkstra.

The only difference:
- Path "cost" is NOT the sum of weights
- Path "cost" is the PRODUCT of probabilities

What we want:
- The path with the MAXIMUM probability

Key Insight (VERY IMPORTANT):
- Probabilities are in range [0, 1]
- Multiplying by another probability NEVER increases the value
- So once we reach a node with the highest possible probability,
```text
  no future path can improve it
```

That preserves Dijkstra’s core invariant:

```text
  ➤ When we pop a node from the heap,
    its best probability is FINAL.
```

REFRAMING THE PROBLEM

Instead of thinking:
```text
  "Shortest path"
```

Think:
```text
  "Most reliable path"
```

The algorithm:
- Always expand the node that currently has the HIGHEST probability
- Try to improve neighbors via this node

This is Dijkstra with:
- Max-heap instead of min-heap
- Multiplication instead of addition

ALGORITHM (Modified Dijkstra)

1. Build adjacency list:
```text
     graph[u] = [v, probability]
```

2. bestProb[i] = maximum probability to reach node i so far

3. Initialize:
```text
     bestProb[start] = 1
     all others = 0
```

4. Use a MAX-HEAP priority queue storing:
```text
     [probability, node]
```

5. While heap is not empty:
```text
     a. Pop node with highest probability
     b. If this is end → return probability (EARLY EXIT)
     c. If stale entry → skip
     d. Relax neighbors:
          newProb = currProb × edgeProb
          if newProb > bestProb[neighbor]:
             update + push
```

TIME & SPACE COMPLEXITY

Time:  O((V + E) log V)
Space: O(V + E)

WHY THIS PROBLEM IS 🔵 CORE

This problem proves whether you REALLY understand Dijkstra.

Interviewers are checking:
- Do you think Dijkstra is only for sums? ❌
- Do you understand greedy invariants? ✅
- Can you change heap direction correctly?

If you can do this cleanly, your foundation is strong.
