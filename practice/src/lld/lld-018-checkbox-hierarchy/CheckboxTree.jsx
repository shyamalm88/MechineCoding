import "./styles.css";

export default function CheckboxTree({ nodes, checked, onCheck, isRoot = true }) {
  return (
    <div className={isRoot ? "checkbox-tree" : undefined}>
      <ul>
        {nodes.map((node) => (
          <li key={node.id}>
            <label className={checked[node.id] ? "checked" : ""}>
              <input
                type="checkbox"
                checked={checked[node.id]}
                onChange={(e) => onCheck(node, e.target.checked)}
              />
              <span className="node-label">{node.label}</span>
            </label>
            {node.children && (
              <CheckboxTree
                nodes={node.children}
                checked={checked}
                onCheck={onCheck}
                isRoot={false}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}