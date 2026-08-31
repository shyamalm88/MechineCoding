# Binary Tree Preorder Traversal (LeetCode #144)

Given the root of a binary tree, return the preorder traversal of its nodes'
values — NODE first, then LEFT subtree, then RIGHT subtree.

Example 1:
Input: root = [1,null,2,3] → Output: [1,2,3]

Example 2:
Input: root = [] → Output: []

Example 3:
Input: root = [4,2,6,1,3,5,7] → Output: [4,2,1,3,6,5,7]

Constraints:
- The number of nodes is in the range [0, 100]
- -100 <= Node.val <= 100

## Follow-up

solve it iteratively.

## Approach

DFS — Recursive, Then an Explicit Stack (Push RIGHT Before LEFT)

## Story / intuition

Preorder visits a node BEFORE its children, which makes it the traversal for
COPYING or SERIALISING a tree: emit a node, then everything under it. That is
exactly why Serialize/Deserialize and Construct Tree from Preorder+Inorder
are built on it.

It is also the easiest traversal to write iteratively, because the visit
happens the moment you pop — no "have I finished my children yet?" bookkeeping.

```text
  pop → visit → push RIGHT → push LEFT
```

The push order is the whole trick and the usual bug. A stack is LIFO, so
whatever goes in last comes out first. Pushing right first means LEFT is on
top and gets processed next — which is what preorder demands. Push left first
and you get a mirrored traversal that looks almost right on a symmetric test
tree and fails on everything else.

## Dry run

[1,null,2,3]  (1 with right child 2, whose left child is 3)
```text
  stack [1] → pop 1, visit 1. push right 2. (no left)      stack [2]
  pop 2, visit 2. no right. push left 3.                   stack [3]
  pop 3, visit 3. no children.                             stack []
  result [1,2,3]
```

Time:  O(N)
Space: O(H) — the stack holds at most one root-to-leaf path plus siblings

 Iterative — pop, visit, then push right BEFORE left.

## Lifo

pushing right first leaves left on top, so left is handled next.

 Recursive — the shape the iterative version is emulating.
