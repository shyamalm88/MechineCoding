# Construct Binary Tree from Preorder and Inorder Traversal (LeetCode #105)

Given two integer arrays preorder and inorder where preorder is the preorder
traversal of a binary tree and inorder is the inorder traversal of the same tree,
construct and return the binary tree.

Example 1:
Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]

Constraints:
- 1 <= preorder.length <= 3000
- inorder.length == preorder.length
- preorder and inorder consist of unique values.

## Approach

Recursion with HashMap Optimization

## Intuition

1. Preorder is [Root, ...Left, ...Right]. The first element is ALWAYS the root.
2. Inorder is [...Left, Root, ...Right].
3. Once we know the Root value from Preorder, we can find it in Inorder.
```text
   Everything to the left of Root in Inorder belongs to the Left Subtree.
   Everything to the right belongs to the Right Subtree.
```

## Optimization

Instead of using `indexOf` (O(N)) and `slice` (O(N)) in every recursive step
(which makes it O(N^2)), we:
1. Build a HashMap of { value: index } for Inorder traversal for O(1) lookup.
2. Pass pointers (start, end) instead of slicing arrays.

Time Complexity: O(N)
Space Complexity: O(N)
