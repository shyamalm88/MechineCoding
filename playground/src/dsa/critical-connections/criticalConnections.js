// ============================================================================
// APPROACH: Tarjan's Algorithm — Discovery Time + Low-Link Value
// ============================================================================
/**
 * STORY / INTUITION:
 * An edge (u, v) is a BRIDGE if removing it disconnects the graph — which
 * happens exactly when `v`'s subtree (in a DFS tree) has NO OTHER WAY to
 * reach `u` or any ancestor of `u` except through this one edge.
 *
 * DFS the graph once, assigning every node a `disc[node]` = the order it
 * was first visited ("timestamp"). Also track `low[node]` = the SMALLEST
 * `disc` value reachable from `node`'s subtree using at most ONE back-edge
 * to an ancestor (a "back edge" = an edge to an already-visited node that
 * ISN'T the direct parent).
 *
 * For each tree edge (u -> v) where v is a child of u in the DFS:
 * - After fully exploring v's subtree, update `low[u] = min(low[u], low[v])`
 *   — u inherits any "escape route" v's subtree found.
 * - If `low[v] > disc[u]`, then v's subtree has NO back edge reaching u or
 *   anything before u — the edge (u,v) is the ONLY connection. BRIDGE!
 *
 * Skip the edge back to the immediate PARENT (it's not a "back edge", just
 * how we arrived here) — but for any OTHER already-visited neighbor,
 * `low[u] = min(low[u], disc[neighbor])` (a genuine back edge / cycle).
 *
 * DRY RUN: n=4, connections=[[0,1],[1,2],[2,0],[1,3]]
 * adj: 0:[1,2]  1:[0,2,3]  2:[1,0]  3:[1]
 *
 * dfs(0, parent=-1): disc[0]=low[0]=0
 *   -> dfs(1, parent=0): disc[1]=low[1]=1
 *        -> dfs(2, parent=1): disc[2]=low[2]=2
 *             neighbor 0 (visited, not parent): low[2]=min(2, disc[0]=0)=0
 *           back to 1: low[1]=min(low[1]=1, low[2]=0)=0
 *           low[2]=0 > disc[1]=1? NO -> (1,2) not a bridge
 *        -> dfs(3, parent=1): disc[3]=low[3]=3 (no other neighbors)
 *           back to 1: low[1]=min(low[1]=0, low[3]=3)=0
 *           low[3]=3 > disc[1]=1? YES -> (1,3) IS A BRIDGE
 *      back to 0: low[0]=min(low[0]=0, low[1]=0)=0
 *      low[1]=0 > disc[0]=0? NO -> (0,1) not a bridge
 *   neighbor 2 (visited, not parent): low[0]=min(0, disc[2]=2)=0
 *
 * Result: [[1,3]] ✓
 *
 * Time:  O(V + E) — one DFS pass over all nodes and edges
 * Space: O(V + E) — adjacency list + disc/low arrays + recursion stack
 */
const criticalConnections = (n, connections) => {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of connections) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const disc = new Array(n).fill(-1);
  const low = new Array(n).fill(-1);
  const bridges = [];
  let timer = 0;

  const dfs = (u, parent) => {
    disc[u] = low[u] = timer++;

    for (const v of adj[u]) {
      if (v === parent) continue;

      if (disc[v] === -1) {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > disc[u]) {
          bridges.push([u, v]);
        }
      } else {
        low[u] = Math.min(low[u], disc[v]);
      }
    }
  };

  dfs(0, -1);
  return bridges;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Critical Connections in a Network Tests ===\n");

console.log(
  "Test 1:",
  JSON.stringify(criticalConnections(4, [[0, 1], [1, 2], [2, 0], [1, 3]]))
); // Expected: [[1,3]]

console.log("Test 2:", JSON.stringify(criticalConnections(2, [[0, 1]]))); // Expected: [[0,1]]

console.log(
  "Test 3:",
  JSON.stringify(
    criticalConnections(6, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 3]])
  )
); // Expected: [[1,3]] (3-4-5-3 is a cycle, 0-1-2-0 is a cycle, only 1-3 bridges them)

module.exports = { criticalConnections };
