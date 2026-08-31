# Invert Binary Tree (LeetCode #226)

Given the root of a binary tree, invert the tree, and return its root.

Example 1:
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Example 2:
Input: root = [2,1,3]
Output: [2,3,1]

Example 3:
Input: root = []
Output: []

Constraints:
- The number of nodes in the tree is in the range [0, 100].
- -100 <= Node.val <= 100

## Approach

Recursive DFS

## Intuition

To invert a tree, we need to swap the left and right children for every node
in the tree.

Algorithm:
1. Base case: If node is null, return null.
2. Swap the left and right pointers of the current node.
3. Recursively call invertTree on the left child.
4. Recursively call invertTree on the right child.

Time Complexity: O(N) - We visit every node once.
Space Complexity: O(H) - Recursion stack height.
