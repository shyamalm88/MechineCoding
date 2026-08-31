# Vertical Order Traversal of a Binary Tree (LeetCode #987)

Given the root of a binary tree, calculate the vertical order traversal.

For each node at position (row, col), its left and right children are at
positions (row + 1, col - 1) and (row + 1, col + 1) respectively. The root
is at (0, 0).

The vertical order traversal is a list of top-to-bottom orderings for each
column, starting from the leftmost column and ending on the rightmost. If
multiple nodes share the same row AND column, order them by their VALUE.

Example 1:
```text
      3
     / \
    9  20
       / \
      15  7
```

Input: root = [3,9,20,null,null,15,7]
Output: [[9],[3,15],[20],[7]]

Example 2:
```text
         1
       /   \
      2     3
     / \   / \
    4   6 5   7
```

Input: root = [1,2,3,4,6,5,7]
Output: [[4],[2],[1,5,6],[3],[7]]
Explanation: Nodes 5 and 6 share position (2,0). Since 5 < 6, 5 comes first.

Constraints:
- 1 <= number of nodes <= 1000
- 0 <= Node.val <= 1000

## Approach

DFS collecting (col, row, val) + Sort

## Story / intuition

Give every node a coordinate, like a spreadsheet cell:
- root starts at (row=0, col=0)
- going left:  row+1, col-1
- going right: row+1, col+1

DFS the whole tree collecting [col, row, val] triples — order of
collection doesn't matter, we'll sort everything at the end.

Then sort by THREE keys, in priority order:
```text
  1. col  (groups nodes into their vertical "columns", left to right)
  2. row  (top to bottom within a column)
  3. val  (tie-break when two nodes land on the exact same cell)
```

Finally, walk the sorted list and start a new output group every time
the column number changes.

## Dry run

root = [1,2,3,4,6,5,7]  (full tree, 3 levels)
Coordinates:
```text
  1 → (0,0)
  2 → (1,-1)   3 → (1,1)
  4 → (2,-2)   6 → (2,0)   5 → (2,0)   7 → (2,2)
```

Triples: [0,0,1] [-1,1,2] [1,1,3] [-2,2,4] [0,2,6] [0,2,5] [2,2,7]

Sort by (col, row, val):
```text
  col=-2: [-2,2,4]
  col=-1: [-1,1,2]
  col= 0: [0,0,1], [0,2,5], [0,2,6]   ← 5 before 6 (same row, val tiebreak)
  col= 1: [1,1,3]
  col= 2: [2,2,7]
```

Group by col: [[4],[2],[1,5,6],[3],[7]] ✓

Time:  O(N log N) — dominated by the sort
Space: O(N) — storing one triple per node
