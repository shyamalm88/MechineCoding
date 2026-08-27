# Keys and Rooms (LeetCode #841)

> Keys and Rooms (LeetCode #841)

Room 0 is unlocked; each room holds keys to others. Can you visit them all?

## Intuition

Rooms are nodes, keys are directed edges. "Can all rooms be visited?" is
exactly "is every node reachable from node 0?" — one traversal from 0, then
compare the visited count to n.

DFS or BFS both work; nothing here favours either, since we only care about
reachability, not distance.

## Time

O(V + E)   SPACE: O(V)
