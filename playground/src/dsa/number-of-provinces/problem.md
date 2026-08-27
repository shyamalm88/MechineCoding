# Number of Provinces (LeetCode #547)

> Number of Provinces (LeetCode #547)

There are n cities. Some of them are connected, while some are not.
If city a is connected directly with city b, and city b is connected
directly with city c, then city a is connected indirectly with city c.

A province is a group of directly or indirectly connected cities and no
other cities outside of the group.

You are given an n x n matrix isConnected where isConnected[i][j] = 1
if the ith city and the jth city are directly connected, and
isConnected[i][j] = 0 otherwise.

Return the total number of provinces.

Example 1:

```text
  City 0 ---- City 1
```

```text
  City 2 (isolated)
```

Input: isConnected = [[1,1,0],[1,1,0],[0,0,1]]
Output: 2
Explanation: City 0 and 1 are connected (province 1). City 2 alone (province 2).

Example 2:

```text
  City 0     City 1     City 2
  (each isolated)
```

Input: isConnected = [[1,0,0],[0,1,0],[0,0,1]]
Output: 3
Explanation: Each city is its own province.

Example 3:

```text
  City 0 ---- City 1 ---- City 2
```

Input: isConnected = [[1,1,0],[1,1,1],[0,1,1]]
Output: 1
Explanation: All cities are connected in one province.

Constraints:
- 1 <= n <= 200
- n == isConnected.length
- n == isConnected[i].length
- isConnected[i][j] is 1 or 0
- isConnected[i][i] == 1 (city is always connected to itself)
- isConnected[i][j] == isConnected[j][i] (symmetric matrix)

## Intuition

Count Connected Components (DFS)

This is the classic "count connected components" problem!

Key Observations:
- isConnected is an ADJACENCY MATRIX (not adjacency list)
- isConnected[i][j] = 1 means city i and j are directly connected
- A province = one connected component in the graph

Algorithm:
1. Keep a visited array to track which cities we've seen
2. For each unvisited city:
```text
   a. Increment province count (found a new province!)
   b. DFS to visit all cities in this province
```

3. Return total province count

Why DFS works:
- Starting from any city, DFS reaches ALL cities in the same province
- After DFS, all cities in that province are marked visited
- Next unvisited city must be in a DIFFERENT province

Visual:

```text
  [1,1,0]      0 -- 1    2
  [1,1,0]  =>
  [0,0,1]      Province 1   Province 2
```

```text
  DFS from 0: visits 0, 1 (marks both visited)
  DFS from 2: visits 2 (marks visited)
  Total: 2 provinces
```

Time Complexity: O(N^2) - check all cells in N×N matrix
Space Complexity: O(N) - visited array + recursion stack
