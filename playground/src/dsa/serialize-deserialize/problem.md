# Serialize and Deserialize Binary Tree (LeetCode #297)

Serialization is the process of converting a data structure or object into
a sequence of bits so that it can be stored or transmitted. Design an
algorithm to serialize and deserialize a binary tree.

The encoded string should be as compact as possible.

Example 1:
```text
        1
       / \
      2   3
         / \
        4   5
```

Input: root = [1,2,3,null,null,4,5]
Output: [1,2,3,null,null,4,5]

Example 2:
Input: root = []
Output: []

Constraints:
- The number of nodes in the tree is in the range [0, 10^4]
- -1000 <= Node.val <= 1000

Approach: Pre-order DFS traversal
- Serialize: Pre-order traversal, use "N" for null nodes
- Deserialize: Reconstruct using same pre-order pattern

Time Complexity: O(n) for both operations
Space Complexity: O(n) - string storage and recursion stack
