import { useState } from "react";
import { treeData } from "./data";
import CheckboxTree from "./CheckboxTree";
import "./styles.css";
// Sample tree data


// Helper to initialize checked state for all nodes
const getInitialChecked = (nodes) => { // Recursively build checked state
  let checked = {};
  nodes.forEach((node) => {
    checked[node.id] = false; // Set all to false initially
    if (node.children) {
      checked = { ...checked, ...getInitialChecked(node.children) }; // Merge child states
    }
  });
  return checked;
};



export default function App() { // Main App component
  const [checked, setChecked] = useState(getInitialChecked(treeData)); // State for all checkboxes

  // Update all descendants
  const setDescendants = (node, value, checkedState) => {
    checkedState[node.id] = value;
    if (node.children) {
      node.children.forEach((child) => setDescendants(child, value, checkedState));
    }
  };

  // Update ancestors based on children
  const updateAncestors = (node, nodes, checkedState) => {
    for (const parent of nodes) {
      if (parent.children && parent.children.some((child) => child.id === node.id)) {
        checkedState[parent.id] = parent.children.every((child) => checkedState[child.id]);
        updateAncestors(parent, treeData, checkedState);
      } else if (parent.children) {
        updateAncestors(node, parent.children, checkedState);
      }
    }
  };

  // Main handler
  const handleCheck = (node, value) => {
    const newChecked = { ...checked };
    setDescendants(node, value, newChecked);
    updateAncestors(node, treeData, newChecked);
    setChecked(newChecked);
  };

  return (
    <div className="tree-container">
      <h2>Hierarchical Checkbox Tree</h2>
      <CheckboxTree nodes={treeData} checked={checked} onCheck={handleCheck} />
    </div>
  );
}