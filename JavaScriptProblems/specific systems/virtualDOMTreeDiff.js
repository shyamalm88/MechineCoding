// Virtual DOM Tree Diff
// vNode: { type, children[] } | "string"

function diff(oldNode, newNode) {
  if (!oldNode) return { op: "CREATE", node: newNode };
  if (!newNode) return { op: "REMOVE" };
  if (typeof oldNode === "string" || typeof newNode === "string") {
    return oldNode !== newNode ? { op: "REPLACE", node: newNode } : null;
  }
  if (oldNode.type !== newNode.type) return { op: "REPLACE", node: newNode };

  // Same type — recurse into children
  const childPatches = [];
  const max = Math.max(oldNode.children.length, newNode.children.length);
  for (let i = 0; i < max; i++) {
    const patch = diff(oldNode.children[i], newNode.children[i]);
    if (patch) childPatches.push({ index: i, patch });
  }

  return childPatches.length ? { op: "UPDATE_CHILDREN", childPatches } : null;
}

// ─── Usage ───────────────────────────────────────────────────────────────────

const oldTree = {
  type: "div",
  children: [
    { type: "p",    children: ["Hello"] },
    { type: "span", children: ["World"] },
  ],
};

const newTree = {
  type: "div",
  children: [
    { type: "p",    children: ["Hello!"] }, // text changed
    { type: "h1",   children: ["World"] },  // type changed
  ],
};

console.log(JSON.stringify(diff(oldTree, newTree), null, 2));
// {
//   op: "UPDATE_CHILDREN",
//   childPatches: [
//     { index: 0, patch: { op: "UPDATE_CHILDREN", childPatches: [{ index: 0, patch: { op: "REPLACE", node: "Hello!" } }] } },
//     { index: 1, patch: { op: "REPLACE", node: { type: "h1", ... } } }
//   ]
// }

// Key talking points:
// 1. Type mismatch → REPLACE entire subtree, stop recursing
// 2. null return = no change at that node
// 3. Without keys, list reorder looks like replacements — why React needs key prop
