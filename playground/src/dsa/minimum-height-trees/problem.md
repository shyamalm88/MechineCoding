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

## Approach

BFS Leaf-Peeling (Topological Sort on an Undirected Tree)

## Story / intuition

The brute force — root the tree at each node and BFS for its height — is
O(N^2) and times out. The insight that collapses it:

The best roots sit at the CENTRE of the tree's longest path, and a tree has
AT MOST TWO such centroids (two when the longest path has even length, one
when odd). So the answer is never more than two nodes.

Find the centre by peeling: repeatedly strip every current leaf, layer by
layer, like peeling an onion inward. Whatever survives when 2 or fewer nodes
remain IS the centre. A leaf can never be a better root than its neighbour —
rooting one step inward shortens the far side — so no leaf is ever the answer,
and stripping them all is safe.

This is topological sort adapted to an undirected graph: instead of in-degree
0, the frontier is degree 1, and decrementing a neighbour's degree to 1 makes
it the next layer's leaf.

WHY STOP AT 2, NOT 1: peeling removes one node from EACH end of the longest
path per round. If that path has an even number of nodes, two survive together
and both are valid answers; peeling further would wrongly discard one.

## Edge case

n === 1 has no edges and no leaves by the degree-1 test, so the
loop would never run — it is returned directly.

## Dry run

n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]
```text
  degrees: 0:1  1:1  2:1  3:4  4:2  5:1
  leaves = [0,1,2,5], remaining 6 > 2 → strip them, remaining = 2
    0,1,2 each drop node 3: degree 4 → 3 → 2 → 1, so 3 joins the next layer
    5 drops node 4: degree 2 → 1, so 4 joins too
  leaves = [3,4], remaining 2 → loop ends
  answer [3,4]
```

Time:  O(N) — every node and edge handled once
Space: O(N) for the adjacency list and degree array
