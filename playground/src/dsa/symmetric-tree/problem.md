# Symmetric Tree (LeetCode #101)

Given the root of a binary tree, check whether it is a mirror of itself
(i.e., symmetric around its center).

Example 1:
```text
        1
       / \
      2   2
     / \ / \
    3  4 4  3
```

Output: true

Example 2:
```text
        1
       / \
      2   2
       \   \
        3   3
```

Output: false

Constraints:
- The number of nodes in the tree is in the range [1, 1000].
- -100 <= Node.val <= 100

## Approach

Recursive DFS (Two Pointers)

## Intuition

A tree is symmetric if the left subtree is a mirror reflection of the right subtree.
We need a helper function that takes two nodes (let's say t1 and t2) and checks:
1. Are their values equal?
2. Is t1.left a mirror of t2.right?
3. Is t1.right a mirror of t2.left?

Time Complexity: O(N) - We visit every node once.
Space Complexity: O(H) - Recursion stack.
