/**
 * PROBLEM: All Paths From Source to Target (LeetCode #797)
 *
 * List every path from node 0 to node n-1 in a DAG.
 *
 * INTUITION:
 * Enumerating ALL paths (not the shortest) is backtracking, not BFS. Walk
 * depth-first carrying the current path; on reaching the target, record a COPY
 * of it, then undo the last choice and try the next branch.
 *
 * Two details:
 *  - push a COPY ([...path]) or every recorded path aliases the same array
 *    that is still being mutated
 *  - no `visited` set is needed because the graph is acyclic; adding one would
 *    wrongly prune valid alternative paths through a shared node
 *
 * TIME: O(2^n · n) worst case -- there can be exponentially many paths
 * SPACE: O(n) recursion depth
 */
const allPathsSourceTarget = (graph) => {
  const target = graph.length - 1;
  const results = [];

  const dfs = (node, path) => {
    if (node === target) { results.push([...path]); return; } // copy!
    for (const next of graph[node]) {
      path.push(next);
      dfs(next, path);
      path.pop(); // backtrack
    }
  };

  dfs(0, [0]);
  return results;
};

console.log(allPathsSourceTarget([[1, 2], [3], [3], []])); // [[0,1,3],[0,2,3]]
console.log(allPathsSourceTarget([[4,3,1],[3,2,4],[3],[4],[]]).length); // 5
