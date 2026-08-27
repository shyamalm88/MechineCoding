# Validate Binary Search Tree (LeetCode #98)

> Validate Binary Search Tree (LeetCode #98)

Given the root of a binary tree, determine if it is a valid binary search
tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than
```text
  the node's key.
```

- The right subtree of a node contains only nodes with keys greater than
```text
  the node's key.
```

- Both the left and right subtrees must also be binary search trees.

Example 1:
```text
      2
     / \
    1   3
```

Input: root = [2,1,3]
Output: true

Example 2:
```text
      5
     / \
    1   4
       / \
      3   6
```

Input: root = [5,1,4,null,null,3,6]
Output: false
Explanation: The root node's value is 5 but its right child's value is 4.

Example 3 (Tricky case):
```text
      5
     / \
    4   6
       / \
      3   7
```

Input: root = [5,4,6,null,null,3,7]
Output: false
Explanation: 3 is in right subtree of 5, but 3 < 5. Invalid!

Constraints:
- The number of nodes in the tree is in the range [1, 10^4]
- -2^31 <= Node.val <= 2^31 - 1

Approach: DFS with valid range propagation
Time Complexity: O(n) - visit each node once
Space Complexity: O(h) - recursion stack, h = height of tree
