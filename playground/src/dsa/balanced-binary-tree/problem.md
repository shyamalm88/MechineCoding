# Balanced Binary Tree (LeetCode #110)

Given a binary tree, determine if it is height-balanced.

For this problem, a height-balanced binary tree is defined as:
a binary tree in which the left and right subtrees of every node differ
in height by no more than 1.

Example 1:
Input: root = [3,9,20,null,null,15,7]
Output: true

Example 2:
Input: root = [1,2,2,3,3,null,null,4,4]
Output: false

Constraints:
- The number of nodes in the tree is in the range [0, 5000].
- -10^4 <= Node.val <= 10^4

## Approach

Bottom-Up DFS

## Intuition

Instead of calculating height for every node from the top down (which would be O(N^2)),
we can check balance from the bottom up.

We use a helper function that returns the height of the tree if it is balanced,
or -1 if it is unbalanced.

1. If a subtree returns -1, the current tree is also unbalanced (-1).
2. If the absolute difference between left and right height > 1, return -1.
3. Otherwise, return 1 + max(leftHeight, rightHeight).

Time Complexity: O(N) - We visit every node once.
Space Complexity: O(H) - Recursion stack.
