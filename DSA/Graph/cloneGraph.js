function Node(value = 0, neighbors = []) {
  this.val = value;
  this.neighbors = neighbors;
}
const cloneGraph = (node) => {
  if (!node) return null;
  let map = new Map();

  const dfs = (node) => {
    if (map.has(node)) {
      return map.get(node);
    }
    const clone = new Node(node.val);
    map.set(node, clone);

    for (let neighbor of node.neighbors) {
      clone.neighbors.push(dfs(neighbor));
    }
    return clone;
  };

  return dfs(node);
};
