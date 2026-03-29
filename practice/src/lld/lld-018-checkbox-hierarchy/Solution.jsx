import { useState } from "react";
import { treeData } from "./data";
import CheckboxTree from "./CheckboxTree";
import "./styles.css";

// ---------------------------------------------------------------------------
// STATE DESIGN: flat map { [id]: boolean } instead of nested tree state
// Why flat? O(1) lookup and update per node. No deep cloning needed.
// { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false }
// ---------------------------------------------------------------------------
function getInitialChecked(nodes) {
  let state = {};
  for (const node of nodes) {
    state[node.id] = false;
    if (node.children) {
      // Merge child states into the same flat map
      state = { ...state, ...getInitialChecked(node.children) };
    }
  }
  return state;
}

// ---------------------------------------------------------------------------
// DOWNWARD PROPAGATION — check/uncheck a node AND all its descendants
// Pattern: DFS — set current node, then recurse into children
// ---------------------------------------------------------------------------
function setDescendants(node, value, state) {
  state[node.id] = value;
  if (node.children) {
    for (const child of node.children) {
      setDescendants(child, value, state);
    }
  }
}

// ---------------------------------------------------------------------------
// UPWARD PROPAGATION — after changing a node, update all its ancestors
// Rule: parent is checked only when ALL its children are checked
// Pattern: search from root, find the parent of the changed node, update it,
// then recurse upward until we reach the root
// ---------------------------------------------------------------------------
const updateAncestors = (changedNode, nodes, state) => {
  for (const node of nodes) {
    if (!node.children) continue;

    if (node.children.some((c) => c.id === changedNode.id)) {
      // direct assignment — no need for ternary
      state[node.id] = node.children.every((c) => state[c.id]);
      updateAncestors(node, treeData, state); // walk upward
      return; // found parent — stop searching siblings
    }

    updateAncestors(changedNode, node.children, state); // search deeper
  }
};

// ---------------------------------------------------------------------------
// App — owns the checked state and wires the two propagation functions
// ---------------------------------------------------------------------------
export default function App() {
  const [checked, setChecked] = useState(() => getInitialChecked(treeData));

  function handleCheck(node, value) {
    // Always work on a shallow copy — never mutate state directly
    const next = { ...checked };

    // Step 1: propagate downward (check/uncheck all descendants)
    setDescendants(node, value, next);

    // Step 2: propagate upward (recalculate all ancestor states)
    updateAncestors(node, treeData, next);

    setChecked(next);
  }

  return (
    <div className="tree-container">
      <h2>Hierarchical Checkbox Tree</h2>
      <CheckboxTree nodes={treeData} checked={checked} onCheck={handleCheck} />
    </div>
  );
}
