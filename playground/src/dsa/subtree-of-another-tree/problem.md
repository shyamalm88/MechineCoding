# Subtree of Another Tree (LeetCode #572)

Given the roots of two binary trees root and subRoot, return true if there is
a subtree of root with the same structure and node values of subRoot and
false otherwise.

A subtree of a binary tree tree is a tree that consists of a node in tree
and all of this node's descendants. The tree tree could also be considered
as a subtree of itself.

Example 1:
Input: root = [3,4,5,1,2], subRoot = [4,1,2]
Output: true

Example 2:
Input: root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]
Output: false

Constraints:
- The number of nodes in the root tree is in the range [1, 2000].
- The number of nodes in the subRoot tree is in the range [1, 1000].
- -10^4 <= root.val, subRoot.val <= 10^4

## Approach

DFS with Helper

## Intuition

We need to traverse the main `root` tree. For every node we visit, we treat
it as a potential candidate for the root of the `subRoot` tree.

We use a helper function `isSameTree(p, q)` which checks if two trees are identical.

Algorithm:
1. If `subRoot` is null, it's technically a subtree of anything (or handle per constraints).
2. If `root` is null, it cannot contain `subRoot` (unless subRoot is null).
3. Check if the tree starting at `root` is identical to `subRoot`.
4. If not, recursively check if `subRoot` is a subtree of `root.left` OR `root.right`.

Time Complexity: O(M * N) - In worst case, for every node in root (N), we compare with subRoot (M).
Space Complexity: O(H) - Recursion stack.
