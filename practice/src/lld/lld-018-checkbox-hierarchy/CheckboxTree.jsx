import { useRef, useEffect, memo } from "react";
import "./styles.css";

// ---------------------------------------------------------------------------
// TreeNode — renders a single checkbox + its children recursively
// memo() prevents re-render if props haven't changed (important for large trees)
// ---------------------------------------------------------------------------
const TreeNode = memo(function TreeNode({ node, checked, onCheck }) {
  const inputRef = useRef(null);

  // Indeterminate state: some children checked, but not all
  // This is a DOM property — can't be set via React props, must use a ref
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate(node, checked);
    }
  }, [node.id, checked]);

  return (
    <li>
      <label>
        <input
          ref={inputRef}
          type="checkbox"
          checked={checked[node.id] ?? false}
          onChange={(e) => onCheck(node, e.target.checked)}
        />
        <span className="node-label">{node.label}</span>
      </label>

      {/* Recurse into children if they exist */}
      {node.children && (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              checked={checked}
              onCheck={onCheck}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

// ---------------------------------------------------------------------------
// isIndeterminate — true when SOME (not all) children are checked
// Only leaf nodes are never indeterminate
// ---------------------------------------------------------------------------
function isIndeterminate(node, checked) {
  if (!node.children) return false;

  const checkedCount = node.children.filter(
    (child) => checked[child.id],
  ).length;

  // Partial selection = some checked, not all checked
  return checkedCount > 0 && checkedCount < node.children.length;
}

// ---------------------------------------------------------------------------
// CheckboxTree — entry point, wraps the list in a semantic container
// ---------------------------------------------------------------------------
export default function CheckboxTree({ nodes, checked, onCheck }) {
  return (
    <div className="checkbox-tree">
      <ul>
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            checked={checked}
            onCheck={onCheck}
          />
        ))}
      </ul>
    </div>
  );
}
