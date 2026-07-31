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

// ─── Apply ──────────────────────────────────────────────────────────────────
// Mirrors the vnode shape (no real browser DOM here), so "mounting" is just a
// deep clone — the applied tree must be independent of the vnode literals,
// the same way a real DOM is a separate structure from the vnode describing it.

function cloneTree(vnode) {
  if (typeof vnode === "string") return vnode;
  return { type: vnode.type, children: vnode.children.map(cloneTree) };
}

function applyChildPatch(parent, index, patch) {
  if (!patch) return; // null = no change at this position

  switch (patch.op) {
    case "CREATE":
      parent.children.splice(index, 0, cloneTree(patch.node));
      break;
    case "REMOVE":
      parent.children.splice(index, 1);
      break;
    case "REPLACE":
      parent.children[index] = cloneTree(patch.node);
      break;
    case "UPDATE_CHILDREN": {
      const target = parent.children[index];
      // Apply in DESCENDING index order: CREATE/REMOVE splice the children
      // array, shifting every index after them. Processing high indices
      // first means a splice never invalidates an index we haven't used yet.
      const sorted = [...patch.childPatches].sort((a, b) => b.index - a.index);
      for (const { index: childIndex, patch: childPatch } of sorted) {
        applyChildPatch(target, childIndex, childPatch);
      }
      break;
    }
  }
}

function applyPatch(root, patch) {
  // Wrap root as the lone child of a synthetic parent so CREATE/REMOVE/
  // REPLACE at the root level reuse the exact same splice-based logic as
  // every other position, instead of needing separate root-only handling.
  const wrapper = { children: [root] };
  applyChildPatch(wrapper, 0, patch);
  return wrapper.children[0];
}

// ─── Usage ───────────────────────────────────────────────────────────────────

const oldTree = {
  type: "div",
  children: [
    { type: "p", children: ["Hello"] },
    { type: "span", children: ["World"] },
  ],
};

const newTree = {
  type: "div",
  children: [
    { type: "p", children: ["Hello!"] }, // text changed
    { type: "h1", children: ["World"] }, // type changed
  ],
};

const patch = diff(oldTree, newTree);
console.log(JSON.stringify(patch, null, 2));
// {
//   op: "UPDATE_CHILDREN",
//   childPatches: [
//     { index: 0, patch: { op: "UPDATE_CHILDREN", childPatches: [{ index: 0, patch: { op: "REPLACE", node: "Hello!" } }] } },
//     { index: 1, patch: { op: "REPLACE", node: { type: "h1", ... } } }
//   ]
// }

const mounted = cloneTree(oldTree); // stand-in for "the real DOM tree"
const patched = applyPatch(mounted, patch);
console.log(JSON.stringify(patched, null, 2));
console.log(
  "patched matches newTree:",
  JSON.stringify(patched) === JSON.stringify(newTree),
); // true

// Key talking points:
// 1. Type mismatch → REPLACE entire subtree, stop recursing
// 2. null return = no change at that node
// 3. Without keys, list reorder looks like replacements — why React needs key prop
// 4. Applying patches within a parent must go in descending index order —
//    otherwise a CREATE/REMOVE earlier in the array shifts the positions
//    of patches still waiting to be applied later in the same batch
