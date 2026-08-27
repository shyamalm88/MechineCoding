# Bus Routes (LeetCode #815)

You are given an array routes representing bus routes where routes[i] is a
bus route that the ith bus repeats forever.

For example, if routes[0] = [1, 5, 7], this means that the 0th bus travels
in the sequence 1 -> 5 -> 7 -> 1 -> 5 -> 7 -> ...

You start at the bus stop source (You are not on any bus initially), and you
want to go to the bus stop target. You can travel between bus stops by buses
only.

Return the least number of buses you must take to travel from source to
target. Return -1 if it is not possible.

Example 1:
Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6
Output: 2
Explanation: The best strategy is take the first bus to the bus stop 7,
```text
             then take the second bus to the bus stop 6.
```

Example 2:
Input: routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12
Output: -1

Constraints:
- 1 <= routes.length <= 500.
- 1 <= routes[i].length <= 10^5.
- All the values of routes[i] are unique.
- sum(routes[i].length) <= 10^5.
- 0 <= routes[i][j] < 10^6.
- 0 <= source, target < 10^6.

## Intuition

Breadth-First Search (BFS) on Routes

This is a shortest path problem in an unweighted graph.

Key Insight:
- Instead of treating stops as nodes (which would create too many edges),
```text
  we treat each BUS ROUTE as a node.
```

- Two routes are connected if they share a common stop.
- We want the shortest path from any route containing 'source' to any
```text
  route containing 'target'.
```

Algorithm:
1. Build a map: Stop -> List of Routes passing through it.
2. Use BFS to explore routes level by level.
3. Start by adding all routes that contain the 'source' stop to the queue.
4. For each route in the queue:
```text
   a. Check all stops in this route.
   b. If a stop is 'target', return current bus count.
   c. Find all other routes connected to these stops.
   d. Add unvisited routes to the queue.
```

5. Optimization: Keep track of visited stops to avoid checking the same
```text
   transfer point multiple times.
```

Time Complexity: O(N + S), where N is number of routes and S is total number of stops in all routes.
Space Complexity: O(N + S) for the map and queue.
