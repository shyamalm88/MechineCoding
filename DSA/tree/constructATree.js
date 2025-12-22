const constructTree = (preOrder, inOrder) => {
  const dfs = (preOrder, inOrder) => {
    if (preOrder.length === 0) {
      return null;
    }
    let nodeVal = preOrder[0];
    let node = new Node(nodeVal);
    const index = inOrder.indexOf(nodeVal);
    node.left = dfs(preOrder.slice(1, index + 1), inOrder.slice(0, index));
    node.right = dfs(preOrder.slice(index + 1), inOrder.slice(index + 1));
    return node;
  };
  return dfs(preOrder, inOrder);
};
