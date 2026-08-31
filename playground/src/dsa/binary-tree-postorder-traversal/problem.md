# Binary Tree Postorder Traversal (LeetCode #145)

Given the root of a binary tree, return the postorder traversal of its nodes'
values — LEFT subtree, then RIGHT subtree, then NODE.

Example 1:
Input: root = [1,null,2,3] → Output: [3,2,1]

Example 2:
Input: root = [] → Output: []

Example 3:
Input: root = [4,2,6,1,3,5,7] → Output: [1,3,2,5,7,6,4]

Constraints:
- The number of nodes is in the range [0, 100]
- -100 <= Node.val <= 100

## Follow-up

solve it iteratively.

## Approach

DFS — Recursive, Then Reversed "Root-Right-Left"

## Story / intuition

Postorder visits a node only AFTER both its children, which makes it the
traversal for anything that must aggregate upward: computing height, deleting
a tree, Diameter of Binary Tree, Binary Tree Maximum Path Sum. A node cannot
answer until its children have.

That "wait for both children" rule is what makes it the AWKWARD one to write
iteratively — on popping a node you cannot tell whether you are arriving at
it or returning to it.

The clean trick: postorder is Left-Right-Node. Reverse it and you get
Node-Right-Left — which is just preorder with the push order flipped, and
preorder is trivial iteratively. So:

```text
  run preorder but push LEFT before RIGHT (giving Node-Right-Left),
  then reverse the result.
```

## Dry run

[1,null,2,3]  (1 with right child 2, whose left child is 3)
```text
  Node-Right-Left pass: visit 1, visit 2, visit 3  → [1,2,3]
  reverse                                          → [3,2,1]
```

Time:  O(N) — one pass plus one reverse
Space: O(N) for the output (O(H) for the stack)

 Iterative — build Node-Right-Left, then reverse into Left-Right-Node.

 Recursive — the definition, stated directly.
