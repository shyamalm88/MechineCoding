# Count Good Nodes in Binary Tree (LeetCode #1448)

Given a binary tree root, a node X in the tree is named good if in the path
from root to X there are no nodes with a value greater than X.

Return the number of good nodes in the binary tree.

Example 1:
Input: root = [3,1,4,3,null,1,5]
Output: 4
Explanation: Nodes in blue are good.
Root Node (3) is always a good node.
Node 4 -> (3,4) is the maximum value in the path starting from the root.
Node 5 -> (3,4,5) is the maximum value in the path
Node 3 -> (3,1,3) is the maximum value in the path.

Constraints:
- The number of nodes in the binary tree is in the range [1, 10^5].
- Each node's value is between [-10^4, 10^4].

## Approach

DFS with State (Max So Far)

## Intuition

We need to traverse the tree (DFS) and keep track of the maximum value we have
encountered so far in the current path from the root.

For each node:
1. Compare node.val with maxSoFar.
2. If node.val >= maxSoFar, it's a "Good Node". Increment count and update maxSoFar.
3. Continue to children passing the (possibly updated) maxSoFar.

Time Complexity: O(N)
Space Complexity: O(H)
