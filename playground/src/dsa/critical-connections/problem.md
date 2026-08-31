# Critical Connections in a Network (LeetCode #1192)

There are `n` servers numbered from 0 to n-1 connected by undirected
server-to-server `connections`. A CRITICAL CONNECTION is a connection
that, if removed, would split the network into two or more disconnected
groups (i.e., it's a "bridge" — not part of any cycle).

Return all critical connections, in any order.

Example 1:
Input: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]
Output: [[1,3]]
Explanation: 0-1-2-0 forms a cycle (none of those edges are critical),
but 1-3 is the only link to server 3 — removing it isolates server 3.

Example 2:
Input: n = 2, connections = [[0,1]]
Output: [[0,1]]

Constraints:
- 1 <= n <= 10^5
- n-1 <= connections.length <= 10^5
- The graph is guaranteed connected, with no repeated/self connections.

## Approach

Tarjan's Algorithm — Discovery Time + Low-Link Value

## Story / intuition

An edge (u, v) is a BRIDGE if removing it disconnects the graph — which
happens exactly when `v`'s subtree (in a DFS tree) has NO OTHER WAY to
reach `u` or any ancestor of `u` except through this one edge.

DFS the graph once, assigning every node a `disc[node]` = the order it
was first visited ("timestamp"). Also track `low[node]` = the SMALLEST
`disc` value reachable from `node`'s subtree using at most ONE back-edge
to an ancestor (a "back edge" = an edge to an already-visited node that
ISN'T the direct parent).

For each tree edge (u -> v) where v is a child of u in the DFS:
- After fully exploring v's subtree, update `low[u] = min(low[u], low[v])`
```text
  — u inherits any "escape route" v's subtree found.
```

- If `low[v] > disc[u]`, then v's subtree has NO back edge reaching u or
```text
  anything before u — the edge (u,v) is the ONLY connection. BRIDGE!
```

Skip the edge back to the immediate PARENT (it's not a "back edge", just
how we arrived here) — but for any OTHER already-visited neighbor,
`low[u] = min(low[u], disc[neighbor])` (a genuine back edge / cycle).

## Dry run

n=4, connections=[[0,1],[1,2],[2,0],[1,3]]
adj: 0:[1,2]  1:[0,2,3]  2:[1,0]  3:[1]

dfs(0, parent=-1): disc[0]=low[0]=0
```text
  -> dfs(1, parent=0): disc[1]=low[1]=1
       -> dfs(2, parent=1): disc[2]=low[2]=2
            neighbor 0 (visited, not parent): low[2]=min(2, disc[0]=0)=0
          back to 1: low[1]=min(low[1]=1, low[2]=0)=0
          low[2]=0 > disc[1]=1? NO -> (1,2) not a bridge
       -> dfs(3, parent=1): disc[3]=low[3]=3 (no other neighbors)
          back to 1: low[1]=min(low[1]=0, low[3]=3)=0
          low[3]=3 > disc[1]=1? YES -> (1,3) IS A BRIDGE
     back to 0: low[0]=min(low[0]=0, low[1]=0)=0
     low[1]=0 > disc[0]=0? NO -> (0,1) not a bridge
  neighbor 2 (visited, not parent): low[0]=min(0, disc[2]=2)=0
```

Result: [[1,3]] ✓

Time:  O(V + E) — one DFS pass over all nodes and edges
Space: O(V + E) — adjacency list + disc/low arrays + recursion stack
