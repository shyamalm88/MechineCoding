# Minimum Cost to Reach Destination in Time (LeetCode #1928)

> Minimum Cost to Reach Destination in Time (LeetCode #1928)

## Category

🟡 OPTIONAL (Dijkstra + State Pruning)

You are given:
- n cities labeled 0 to n-1
- edges[i] = [u, v, time]  (undirected)
- passingFees[i] = cost of visiting city i
- maxTime = maximum total time allowed

You start at city 0 and want to reach city n-1.

Goal:
- MINIMIZE total cost
- Subject to total time <= maxTime

Return the minimum cost to reach destination within maxTime.
If impossible, return -1.

Example:

```text
  n = 5
  edges = [[0,1,10],[1,2,10],[2,3,10],[3,4,10],[0,4,50]]
  passingFees = [5,1,2,20,20]
  maxTime = 30
```

```text
  Path:
    0 → 1 → 2 → 3 → 4
  Time = 40 ❌ (too long)
```

```text
  Path:
    0 → 4
  Time = 50 ❌
```

```text
  Output: -1
```

Constraints:
- 1 <= n <= 1000
- 0 <= edges.length <= 10000
- 1 <= passingFees[i] <= 1000
- 1 <= maxTime <= 1000

## Intuition

Why This Is NOT Plain Dijkstra

In standard Dijkstra:
```text
  - We minimize distance (or cost)
```

Here:
```text
  - We minimize COST
  - But TIME is a HARD CONSTRAINT
```

Key Insight (CRITICAL):

```text
  Reaching the same city at different times
  leads to different future possibilities.
```

So:
```text
  (city = 3, time = 10) ≠ (city = 3, time = 25)
```

A simple dist[city] is WRONG.

STATE MODELING

State = (city, timeSpent)

We track:
```text
  cost[city][time] = minimum cost to reach city
                     using exactly `time` time
```

We want:
```text
  min cost at (n-1, time <= maxTime)
```

ALGORITHM (Dijkstra with Pruning)

1. Build adjacency list
2. cost[city][time] initialized to Infinity
3. Min-heap ordered by totalCost
4. Start from (0, time=0, cost=passingFees[0])

For each state popped:
```text
  - If city == destination → return cost
  - Try all neighbors:
       newTime = time + edgeTime
       newCost = cost + passingFees[neighbor]
       if newTime <= maxTime AND newCost < cost[neighbor][newTime]:
           update and push
```

Optimization:
- We prune worse states aggressively

TIME & SPACE COMPLEXITY

Let:
- V = cities
- E = edges
- T = maxTime

Time:  O(E × T log (V × T))
Space: O(V × T)

WHY THIS PROBLEM IS 🟡 OPTIONAL

This problem is rare in interviews.

It mainly tests:
- Multi-dimensional state reasoning
- Constraint-based shortest paths

Great for depth, but not required for most roles.
