# Pacific Atlantic Water Flow (LeetCode #417)

There is an m x n rectangular island that borders both the Pacific Ocean
and the Atlantic Ocean. The Pacific Ocean touches the island's left and
top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island is partitioned into a grid of square cells. You are given an
m x n integer matrix heights where heights[r][c] represents the height
above sea level of the cell at coordinate (r, c).

The island receives a lot of rain, and the rain water can flow to
neighboring cells directly north, south, east, and west if the neighboring
cell's height is less than or equal to the current cell's height.
Water can flow from any cell adjacent to an ocean into the ocean.

Return a 2D list of grid coordinates result where result[i] = [ri, ci]
denotes that rain water can flow from cell (ri, ci) to both the Pacific
and Atlantic oceans.

Example 1:

```text
  Pacific Ocean (top & left)
       ~  ~  ~  ~  ~
    ~  1  2  2  3  5  *
    ~  3  2  3  4  4  *
    ~  2  4  5  3  1  *
    ~  6  7  1  4  5  *
    ~  5  1  1  2  4  *
       *  *  *  *  *
  Atlantic Ocean (bottom & right)
```

Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
Explanation: Cells where water can flow to both oceans are marked.

Example 2:
Input: heights = [[1]]
Output: [[0,0]]
Explanation: Single cell can reach both oceans (it's on all edges).

Constraints:
- m == heights.length
- n == heights[r].length
- 1 <= m, n <= 200
- 0 <= heights[r][c] <= 10^5

## Intuition

Reverse DFS from Ocean Edges

Naive Approach (TLE):
- From each cell, DFS to check if it can reach Pacific
- From each cell, DFS to check if it can reach Atlantic
- O(m*n) cells × O(m*n) DFS each = O((m*n)^2) - Too slow!

Optimized Approach (Reverse Flow):
- Instead of "can water flow FROM this cell TO ocean?"
- Ask "can water flow TO this cell FROM ocean?" (reverse direction)
- Start DFS from ocean edges and go UPHILL (>= height)

Why Reverse Works:
- Normal: water flows from HIGH to LOW (or equal)
- Reverse: we go from LOW to HIGH (or equal)
- If reverse path exists: ocean -> cell, then normal path exists: cell -> ocean

Algorithm:
1. Create two Sets: pacificReachable, atlanticReachable
2. DFS from Pacific edges (top row + left column)
3. DFS from Atlantic edges (bottom row + right column)
4. Return cells that are in BOTH sets (intersection)

Visual of DFS direction:

```text
  Pacific starts here
       ↓  ↓  ↓  ↓  ↓
    →  1  2  2  3  5
    →  3  2  3  4  4  ←  Atlantic starts here
    →  2  4  5  3  1  ←
    →  6  7  1  4  5  ←
    →  5  1  1  2  4  ←
       ↑  ↑  ↑  ↑  ↑
```

Time Complexity: O(M * N) - each cell visited at most twice (once per ocean)
Space Complexity: O(M * N) - two Sets + recursion stack
