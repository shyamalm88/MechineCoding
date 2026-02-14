/**
 * ============================================================================
 * PROBLEM: Network Delay Time (LeetCode #743)
 * ============================================================================
 * You are given a network of n nodes, labeled from 0 to n-1 (or 1 to n).
 * You are also given times, a list of travel times as directed edges
 * times[i] = (u, v, w), where u is the source node, v is the target node,
 * and w is the time it takes for a signal to travel from source to target.
 *
 * We send a signal from a given node `source`. Return true if all n nodes
 * receive the signal within `K` time, otherwise false.
 */

// ============================================================================
// APPROACH: Dijkstra's Algorithm
// ============================================================================
/**
 * INTUITION:
 * This is a classic "Single Source Shortest Path" problem with non-negative weights.
 * We need to find the minimum time to reach every node from the source.
 * If the maximum of these minimum times is <= K, then all users are reached.
 *
 * Dijkstra's algorithm is optimal here.
 * 1. Initialize distances to Infinity, dist[source] = 0.
 * 2. Use a Min-Priority Queue to explore nodes with the smallest current distance.
 * 3. Relax edges: if dist[u] + weight < dist[v], update dist[v] and push to PQ.
 *
 * DRY RUN:
 * Nodes: 3, Source: 0, K: 10
 * Edges: [[0, 1, 5], [1, 2, 3], [0, 2, 10]]
 *
 * 1. Dist: [0, Inf, Inf]. PQ: [[0, 0]] (time, node)
 *
 * 2. Pop [0, 0]. Neighbors:
 *    - 1: cost 5. New dist 5 < Inf. Dist: [0, 5, Inf]. PQ: [[5, 1]]
 *    - 2: cost 10. New dist 10 < Inf. Dist: [0, 5, 10]. PQ: [[5, 1], [10, 2]]
 *
 * 3. Pop [5, 1]. Neighbors:
 *    - 2: cost 3. Total 5+3=8. 8 < 10. Dist: [0, 5, 8]. PQ: [[8, 2], [10, 2]]
 *
 * 4. Pop [8, 2]. Neighbors: None.
 *
 * 5. Pop [10, 2]. 10 > dist[2] (8). Ignore.
 *
 * Max dist is 8. 8 <= K (10). Return true.
 */

// Mock MinPriorityQueue for local testing if environment doesn't support it
class MinPriorityQueue {
  constructor(options) { this.q = []; this.priority = options?.priority || (x => x); }
  enqueue(el) { this.q.push(el); this.q.sort((a, b) => this.priority(a) - this.priority(b)); }
  dequeue() { return { element: this.q.shift() }; }
  isEmpty() { return this.q.length === 0; }
}

function canReachAllUsers(n, edges, source, K) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);

  for (const [u, v, t] of edges) {
    graph[u].push([v, t]);
    // if bidirectional, add:
    // graph[v].push([u, t]);
  }

  // Dijkstra
  const dist = Array(n).fill(Infinity);
  dist[source] = 0;

  const pq = new MinPriorityQueue({
    priority: (x) => x[0],
  });

  pq.enqueue([0, source]);

  while (!pq.isEmpty()) {
    const [time, node] = pq.dequeue().element;

    if (time > dist[node]) continue;

    for (const [next, cost] of graph[node]) {
      const newTime = time + cost;

      if (newTime < dist[next]) {
        dist[next] = newTime;
        pq.enqueue([newTime, next]);
      }
    }
  }

  // Check if everyone is reached within K
  for (let i = 0; i < n; i++) {
    if (dist[i] > K) return false;
  }

  return true;
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Can Reach All Users Tests ===\n");

// Test 1: Simple connected graph
const edges1 = [[0, 1, 2], [1, 2, 3]];
console.log("Test 1 (K=6):", canReachAllUsers(3, edges1, 0, 6));
// Expected: true (max time is 5)

// Test 2: Not enough time
console.log("Test 2 (K=4):", canReachAllUsers(3, edges1, 0, 4));
// Expected: false (node 2 needs 5)

// Test 3: Disconnected node
const edges3 = [[0, 1, 1]];
console.log("Test 3 (Disconnected):", canReachAllUsers(3, edges3, 0, 10));
// Expected: false (node 2 unreachable)
 */
function canReachAllUsers(n, edges, source, K) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);

  for (const [u, v, t] of edges) {
    graph[u].push([v, t]);
    // if bidirectional, add:
    // graph[v].push([u, t]);
  }

  // Dijkstra
  const dist = Array(n).fill(Infinity);
  dist[source] = 0;

  const pq = new MinPriorityQueue({
    priority: (x) => x[0],
  });

  pq.enqueue([0, source]);

  while (!pq.isEmpty()) {
    const [time, node] = pq.dequeue().element;

    if (time > dist[node]) continue;

    for (const [next, cost] of graph[node]) {
      const newTime = time + cost;

      if (newTime < dist[next]) {
        dist[next] = newTime;
        pq.enqueue([newTime, next]);
      }
    }
  }

  // Check if everyone is reached within K
  for (let i = 0; i < n; i++) {
    if (dist[i] > K) return false;
  }

  return true;
}
