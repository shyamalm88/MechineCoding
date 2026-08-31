# Binary Tree Inorder Traversal (LeetCode #94)

Given the root of a binary tree, return the inorder traversal of its nodes'
values — LEFT subtree, then NODE, then RIGHT subtree.

Example 1:
Input: root = [1,null,2,3] → Output: [1,3,2]

Example 2:
Input: root = [] → Output: []

Example 3:
Input: root = [4,2,6,1,3,5,7] → Output: [1,2,3,4,5,6,7]

Constraints:
- The number of nodes is in the range [0, 100]
- -100 <= Node.val <= 100

FOLLOW-UP (the part interviews actually care about): solve it iteratively.

## Approach

DFS — Recursive, Then the Explicit-Stack Version

## Story / intuition

Inorder is the traversal that prints a BST in sorted order, which is why it
shows up constantly (Validate BST, Kth Smallest in a BST both lean on it).

Recursion is three lines, but recursion IS a stack — the call stack. The
iterative version just makes that stack explicit, and interviewers ask for
it because it proves you understand what recursion was doing for you.

The iterative shape:
```text
  1. Walk left as far as you can, pushing every node you pass.
  2. Pop. That node has no unvisited left subtree, so VISIT it now.
  3. Move right and repeat.
```

The outer loop condition is `node || stack.length` — not just the stack.
After popping a node and stepping right, the stack can be momentarily empty
while `node` still points at real work. Testing only the stack truncates the
traversal, which is the classic bug here.

## Dry run

[1,null,2,3]  (1 with right child 2, whose left child is 3)
```text
  node=1: push 1, node=null (no left)
  pop 1 → visit 1. node = 1.right = 2
  node=2: push 2, go left → node=3; push 3, node=null
  pop 3 → visit 3. node = null
  pop 2 → visit 2. node = null. stack empty → done
  result [1,3,2]
```

Time:  O(N) — every node pushed and popped once
Space: O(H) where H is the tree height (O(N) for a degenerate tree)

 Iterative — the version to reach for when asked "without recursion".

 Recursive — same order, shorter, uses the call stack instead.
