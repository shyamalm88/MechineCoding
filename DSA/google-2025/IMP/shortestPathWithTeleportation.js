/**
 * ============================================================================
 * PROBLEM: Shortest Path with Teleportation
 * ============================================================================
 * Given an undirected graph with n nodes (0 to n-1) and a list of edges,
 * find the shortest path from a start node to an end node.
 *
 * You have a special ability to "teleport" up to K times.
 * A teleport allows you to move from node u to node w if there exists a node v
 * such that (u, v) and (v, w) are edges.
 * Essentially, you can jump over one intermediate node (distance 2) in a single step.
 *
 * Example 1:
 * Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]], start = 0, end = 4, K = 2
 * Output: 2
 * Explanation:
 * Path: 0 -> 2 (teleport over 1) -> 4 (teleport over 3).
 * Total steps = 2.
 *
 * Example 2:
 * Input: n = 3, edges = [[0,1],[1,2]], start = 0, end = 2, K = 0
 * Output: 2
 * Explanation: 0 -> 1 -> 2. Steps = 2.
 */

// ============================================================================
// APPROACH: BFS with State (Node, TeleportsUsed)
// ============================================================================
/**
 * INTUITION:
 * This is a shortest path problem on an unweighted graph, which suggests BFS.
 * However, the available moves depend on how many teleports we have used.
 *
 * Instead of a simple visited array, we can track the minimum teleports used
 * to reach each node (`minTeleports[node]`).
 *
 * Key Observation:
 * BFS explores layer by layer (increasing steps). If we reach a node `u` at step `S`
 * with `k` teleports, and later reach `u` at step `S'` (where `S' >= S`) with `k'` teleports:
 * - If `k' >= k`, the new path is strictly worse (more steps, more/same teleports). We discard it.
 * - If `k' < k`, the new path uses fewer teleports, so it might enable more jumps later. We keep it.
 *
 * Transitions:
 * 1. Normal Move: Move to an adjacent neighbor.
 *    - Cost: 1 step
 *    - Teleports: Unchanged
 * 2. Teleport Move: Move to a neighbor's neighbor (distance 2).
 *    - Cost: 1 step
 *    - Teleports: +1
 *    - Condition: teleports_used < K
 *
 * DRY RUN:
 * Input: 0-1-2-3, Start=0, End=3, K=1
 * Queue: [[0, 0, 0]] (node, used, steps)
 *
 * 1. Pop [0, 0, 0].
 *    - Normal neighbors of 0: [1].
 *      -> Push [1, 0, 1]. minTeleports[1] = 0.
 *    - Teleport neighbors (dist 2) of 0:
 *      -> Path 0-1-2. Target 2.
 *      -> Push [2, 1, 1]. minTeleports[2] = 1.
 *
 * 2. Pop [1, 0, 1].
 *    - Normal neighbors of 1: [0, 2].
 *      -> 0 visited.
 *      -> Push [2, 0, 2]. minTeleports[2] = 0 (Better than 1).
 *    - Teleport neighbors of 1:
 *      -> Path 1-2-3. Target 3.
 *      -> Push [3, 1, 2]. minTeleports[3] = 1.
 *
 * 3. Pop [2, 1, 1].
 *    - Normal neighbors of 2: [1, 3].
 *      -> 1 visited.
 *      -> Push [3, 1, 2]? minTeleports[3] is 1. 1 < 1 is false. Skip.
 *    - Teleport: Used (1) not < K (1). Skip.
 *
 * 4. Pop [3, 1, 2] (from step 2).
 *    - Node is End (3). Return steps (2).
 *
 * Result: 2 steps (0 -> (teleport) -> 2 -> 3).
 */
/**
 * Problem: Shortest Path with K Teleports (Skips)
 * Complexity: O(K * (V + E) log (V * K))
 * Space: O(V * K)
 */

class PriorityQueue {
  constructor() {
    this.heap = [];
  }
  push(val) {
    this.heap.push(val);
    this.bubbleUp();
  }
  pop() {
    if (this.size() === 1) return this.heap.pop();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown();
    return top;
  }
  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex][0] <= this.heap[index][0]) break;
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      index = parentIndex;
    }
  }
  bubbleDown() {
    let index = 0;
    while (true) {
      let left = 2 * index + 1,
        right = 2 * index + 2,
        smallest = index;
      if (
        left < this.heap.length &&
        this.heap[left][0] < this.heap[smallest][0]
      )
        smallest = left;
      if (
        right < this.heap.length &&
        this.heap[right][0] < this.heap[smallest][0]
      )
        smallest = right;
      if (smallest === index) break;
      [this.heap[smallest], this.heap[index]] = [
        this.heap[index],
        this.heap[smallest],
      ];
      index = smallest;
    }
  }
  size() {
    return this.heap.length;
  }
}

function shortestPathWithTeleports(n, edges, start, end, K) {
  // 1. Build Adjacency List (unweighted graph — every move costs 1 step)
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // 2. dist[node][k_used] stores min cost to reach node using exactly 'k_used' teleports
  const dist = Array.from({ length: n }, () => Array(K + 1).fill(Infinity));
  const pq = new PriorityQueue();

  // Initial State: Start node, 0 cost, 0 teleports used
  dist[start][0] = 0;
  pq.push([0, start, 0]); // [cost, currentNode, kUsed]

  while (pq.size() > 0) {
    const [d, u, kUsed] = pq.pop();

    // Standard Dijkstra Optimization
    if (d > dist[u][kUsed]) continue;
    if (u === end) continue; // Optimization: keep going to find min in other K layers

    for (const v of adj[u]) {
      // OPTION 1: Normal Move (cost 1 step)
      if (dist[u][kUsed] + 1 < dist[v][kUsed]) {
        dist[v][kUsed] = dist[u][kUsed] + 1;
        pq.push([dist[v][kUsed], v, kUsed]);
      }

      // OPTION 2: Teleport Move (Cost 0, increment kUsed)
      if (kUsed < K && dist[u][kUsed] < dist[v][kUsed + 1]) {
        dist[v][kUsed + 1] = dist[u][kUsed];
        pq.push([dist[v][kUsed + 1], v, kUsed + 1]);
      }
    }
  }

  const result = Math.min(...dist[end]);
  return result === Infinity ? -1 : result;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Shortest Path with Teleports Tests ===\n");

// Test 1: Line graph with enough teleports
// 0-1-2-3-4, K=2. Path: 0->2->4. Steps: 2.
const edges1 = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
];
console.log("Test 1 (K=2):", shortestPathWithTeleports(5, edges1, 0, 4, 2));
// Expected: 2

// Test 2: Line graph with limited teleports
// 0-1-2-3-4, K=1. Path: 0->2->3->4. Steps: 3.
console.log("Test 2 (K=1):", shortestPathWithTeleports(5, edges1, 0, 4, 1));
// Expected: 3

// Test 3: No teleports allowed
// 0-1-2, K=0. Path: 0->1->2. Steps: 2.
const edges2 = [
  [0, 1],
  [1, 2],
];
console.log("Test 3 (K=0):", shortestPathWithTeleports(3, edges2, 0, 2, 0));
// Expected: 2

// Test 4: Disconnected graph
const edges3 = [
  [0, 1],
  [2, 3],
];
console.log(
  "Test 4 (Disconnected):",
  shortestPathWithTeleports(4, edges3, 0, 3, 1),
);
// Expected: -1

module.exports = { shortestPathWithTeleports };
