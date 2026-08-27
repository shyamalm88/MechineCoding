# Binary Tree Maximum Path Sum (LeetCode #124)

> Binary Tree Maximum Path Sum (LeetCode #124)

A path in a binary tree is a sequence of nodes where each pair of adjacent
nodes in the sequence has an edge connecting them. A node can only appear
in the sequence at most once. Note that the path does not need to pass
through the root.

The path sum is the sum of the node's values in the path.
Given the root of a binary tree, return the maximum path sum of any non-empty path.

Example 1:
Input: root = [1,2,3]
Output: 6 (2 -> 1 -> 3)

Example 2:
Input: root = [-10,9,20,null,null,15,7]
Output: 42 (15 -> 20 -> 7)

Constraints:
- The number of nodes in the tree is in the range [1, 3 * 10^4].
- -1000 <= Node.val <= 1000
