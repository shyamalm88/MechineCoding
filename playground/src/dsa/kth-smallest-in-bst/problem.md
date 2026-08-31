# Kth Smallest Element in a BST (LeetCode #230)

Given the root of a binary search tree, and an integer k, return the kth
smallest value (1-indexed) of all the values of the nodes in the tree.

Example 1:
Input: root = [3,1,4,null,2], k = 1
Output: 1

Example 2:
Input: root = [5,3,6,2,4,null,null,1], k = 3
Output: 3

Constraints:
- The number of nodes in the tree is n.
- 1 <= k <= n <= 10^4
- 0 <= Node.val <= 10^4

## Approach

Inorder Traversal (DFS)

## Intuition

An Inorder traversal (Left -> Root -> Right) of a BST visits nodes in
sorted ascending order.
We simply perform an inorder traversal and decrement k each time we visit
a node. When k reaches 0, we have found the kth smallest element.

Time Complexity: O(N) (Average O(k) if we stop early)
Space Complexity: O(H)
