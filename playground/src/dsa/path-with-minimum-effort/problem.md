# Path With Minimum Effort (LeetCode #1631)

You are a hiker preparing for an upcoming hike. You are given `heights`, a 2D
array of size rows x columns, where heights[r][c] represents the height of
cell (r, c).

You start at the top-left cell (0, 0) and want to reach the bottom-right cell
(rows-1, cols-1). From any cell, you may move:
```text
  - up
  - down
  - left
  - right
```

The effort of a route is defined as:
```text
  - the MAXIMUM absolute difference in heights between two consecutive cells
    along the route.
```

Your task is to find the minimum possible effort required to travel from
start to destination.

Example:
Input:
```text
  heights = [[1,2,2],
             [3,8,2],
             [5,3,5]]
```

Output: 2

## Approach

Dijkstra / Priority Queue (Minimize the Maximum Edge)

## Intuition

This is a shortest-path problem with a NON-STANDARD cost definition.

- Moving between two adjacent cells has a "cost":
```text
    |height[current] - height[next]|
```

- The total cost of a path is NOT the sum of costs,
```text
  but the MAXIMUM cost encountered along the path.
```

Key Observation:
- As we extend a path, the effort (max edge so far) NEVER decreases.
- This monotonic property allows Dijkstra’s algorithm to work.

Instead of minimizing SUM of edges, we minimize:

```text
  max(edge_1, edge_2, ..., edge_k)
```

## State

- Each cell (r, c) is a node
- lowestEffort[row][col] = minimum possible effort to reach (row, col)

## Edge relaxation

From (r, c) → (nr, nc):

```text
  edgeEffort = |heights[r][c] - heights[nr][nc]|
  worstStepSoFar = max(effortSoFar, stepEffort)
```

If worstStepSoFar < lowestEffort[nextRow][nextCol], update it.

## Algorithm

1. Initialize lowestEffort[][] with Infinity
2. lowestEffort[0][0] = 0
3. Push (0, 0, 0) into min-heap → [effort, row, col]
4. While heap is not empty:
```text
   a. Pop cell with minimum effort so far
   b. If it is destination, return effort
   c. Relax all valid neighbors
```

## Time complexity

- Each cell is processed at most once with its best effort
- Heap operations: O(log(R * C))

Total: O(R * C * log(R * C))

## Space complexity

- dist array: O(R * C)
- priority queue: O(R * C)

 compare(a, b) < 0 means `a` comes out first.

@param {number[][]} heights grid of cell elevations
@return {number} the smallest possible "worst single step" along some path
```text
  from the top-left cell to the bottom-right one
```
