# Binary Tree Right Side View (LeetCode #199)

> Binary Tree Right Side View (LeetCode #199)

Given the root of a binary tree, imagine yourself standing on the right
side of it. Return the values of the nodes you can see ordered from top
to bottom.

Example 1:
```text
        1        <--- 1
       / \
      2   3      <--- 3
       \   \
        5   4    <--- 4
```

Input: root = [1,2,3,null,5,null,4]
Output: [1,3,4]

Example 2:
```text
    1            <--- 1
     \
      3          <--- 3
```

Input: root = [1,null,3]
Output: [1,3]

Example 3:
Input: root = []
Output: []

Constraints:
- The number of nodes in the tree is in the range [0, 100]
- -100 <= Node.val <= 100

Approach: BFS level order, take last node of each level
Time Complexity: O(n) - visit each node once
Space Complexity: O(n) - queue can hold up to n/2 nodes at last level
