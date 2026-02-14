/***********************************************************
 * TREE TRANSFORMATION / COMPARISON
 *
 * Two approaches:
 * 1) Recursive Hashing → Check if trees can be made identical
 * 2) Tree Edit Distance → Minimum operations to transform
 ***********************************************************/

/* =========================================================
 * 1️⃣ RECURSIVE HASHING (Most common interview solution)
 *    - Fast
 *    - Checks structural + value equality
 *    - Order of children does NOT matter
 * ========================================================= */

class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

// Generate a canonical hash for a subtree
function hashTree(node) {
  if (!node) return "#";

  // Hash children first
  const childHashes = node.children.map(hashTree).sort(); // normalize order for unordered trees

  return `${node.val}(${childHashes.join(",")})`;
}

// Compare two trees using hashing
function areTreesIdentical(tree1, tree2) {
  return hashTree(tree1) === hashTree(tree2);
}

/* ===== Example Usage (Hashing) ===== */

const treeA = new TreeNode(1, [new TreeNode(2), new TreeNode(3)]);

const treeB = new TreeNode(1, [new TreeNode(3), new TreeNode(2)]);

console.log("Trees identical (hashing):", areTreesIdentical(treeA, treeB));
// true

/* =========================================================
 * 2️⃣ TREE EDIT DISTANCE (Exact minimum operations)
 *    - Add / Delete / Replace
 *    - Order matters
 *    - More expensive
 * ========================================================= */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// Count number of nodes in a tree (used for insert/delete cost)
function treeSize(node) {
  if (!node) return 0;
  return 1 + treeSize(node.left) + treeSize(node.right);
}

// Minimum operations to transform t1 → t2
function treeEditDistance(t1, t2) {
  // Both empty
  if (!t1 && !t2) return 0;

  // Insert entire subtree
  if (!t1) return treeSize(t2);

  // Delete entire subtree
  if (!t2) return treeSize(t1);

  // Replace cost
  const replaceCost = t1.val === t2.val ? 0 : 1;

  return (
    replaceCost +
    treeEditDistance(t1.left, t2.left) +
    treeEditDistance(t1.right, t2.right)
  );
}

/* ===== Example Usage (Edit Distance) ===== */

const t1 = new BinaryTreeNode(1, new BinaryTreeNode(2), new BinaryTreeNode(3));

const t2 = new BinaryTreeNode(1, new BinaryTreeNode(4), null);

console.log("Tree edit distance:", treeEditDistance(t1, t2));
// Output: minimum operations required

/***********************************************************
 * SUMMARY (for interview)
 *
 * - Recursive Hashing:
 *   Time:  O(N log N)
 *   Space: O(N)
 *   Use when checking tree equivalence
 *
 * - Tree Edit Distance:
 *   Time:  O(N²)–O(N³)
 *   Space: O(N)
 *   Use when exact operation count matters
 ***********************************************************/
