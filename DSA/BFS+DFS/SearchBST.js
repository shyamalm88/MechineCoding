const searchBST = (root, val) => {
  while (root != null && root.data != val) {
    root = root.data > val ? root.left : root.right;
  }
  return root;
};
