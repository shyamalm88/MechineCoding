# All Paths From Source to Target (LeetCode #797)

List every path from node 0 to node n-1 in a DAG.

## Intuition

Enumerating ALL paths (not the shortest) is backtracking, not BFS. Walk
depth-first carrying the current path; on reaching the target, record a COPY
of it, then undo the last choice and try the next branch.

Two details:
 - push a COPY ([...path]) or every recorded path aliases the same array
```text
   that is still being mutated
```

 - no `visited` set is needed because the graph is acyclic; adding one would
```text
   wrongly prune valid alternative paths through a shared node
```

## Complexity

TIME: O(2^n · n) worst case -- there can be exponentially many paths
SPACE: O(n) recursion depth
