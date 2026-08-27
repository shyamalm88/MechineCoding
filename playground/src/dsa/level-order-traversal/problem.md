# Binary Tree Level Order Traversal (LeetCode #102)

> Binary Tree Level Order Traversal (LeetCode #102)

Given the root of a binary tree, return the level order traversal of its
nodes' values. (i.e., from left to right, level by level).

Example 1:
```text
        3
       / \
      9  20
         / \
        15  7
```

Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

Example 2:
Input: root = [1]
Output: [[1]]

Example 3:
Input: root = []
Output: []

Constraints:
- The number of nodes in the tree is in the range [0, 2000]
- -1000 <= Node.val <= 1000

Approach: BFS using queue
Time Complexity: O(n) - visit each node once
Space Complexity: O(n) - queue can hold up to n/2 nodes at last level
