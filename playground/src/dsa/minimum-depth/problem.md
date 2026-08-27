# Minimum Depth of Binary Tree (LeetCode #111)

Shortest root-to-LEAF path length. A leaf has no children.

## Intuition

The trap: min depth is NOT the mirror of max depth. For a node with one
child, `1 + min(left, right)` returns 1 + 0 = 1, but the missing side is not
a leaf — it is absent. A single-child node must take the depth of the child
that exists.

BFS is the better answer anyway: the FIRST leaf encountered is at the minimum
depth, so you can return immediately without exploring a deep subtree.

## Time

O(n) worst case, often far less with BFS · SPACE: O(w)
