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
