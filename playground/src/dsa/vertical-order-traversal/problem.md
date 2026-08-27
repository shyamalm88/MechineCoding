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
