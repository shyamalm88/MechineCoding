# Minimum Height Trees (LeetCode #310)

A tree is an undirected graph with n nodes labelled 0..n-1 and n-1 edges.
Rooting the tree at different nodes gives trees of different heights. Return
a list of all root labels that give a MINIMUM height tree, in any order.

Example 1:
Input: n = 4, edges = [[1,0],[1,2],[1,3]] → Output: [1]

Example 2:
Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]] → Output: [3,4]

Constraints:
- 1 <= n <= 2 * 10^4
- edges.length == n - 1
- The given input is guaranteed to be a tree
