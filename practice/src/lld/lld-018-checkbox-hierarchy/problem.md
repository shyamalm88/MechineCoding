# Hierarchical Checkbox Tree

## Problem Statement

Build a **Hierarchical Checkbox Tree** component where checking/unchecking a parent checkbox automatically affects all its descendants, and the parent's state reflects its children's state. This is a classic tree data structure problem with UI synchronization.

This pattern is essential for:
- File/folder permission systems
- Category filters in e-commerce
- Organization hierarchy selection
- Settings panels with grouped options
- Access control interfaces
- Nested todo lists

---

## Requirements

### Functional Requirements

1. **Tree Rendering**
   - Render nested checkbox items recursively
   - Display parent-child relationships visually
   - Support arbitrary depth levels

2. **Downward Propagation**
   - Checking a parent checks ALL descendants
   - Unchecking a parent unchecks ALL descendants

3. **Upward Propagation**
   - Parent becomes checked when ALL children are checked
   - Parent becomes unchecked when ANY child is unchecked

4. **State Management**
   - Maintain flat state object for all nodes
   - Efficient updates without re-rendering entire tree

### Non-Functional Requirements

- Handle deeply nested trees (10+ levels)
- Performant with many nodes (1000+)
- Accessible (keyboard navigation, ARIA)
- Visual hierarchy indication

---

## Visual Representation

```
Initial State (all unchecked):
☐ Parent 1
│
├── ☐ Child 1-1
│
└── ☐ Child 1-2

☐ Parent 2
│
└── ☐ Child 2-1
    │
    └── ☐ Grandchild 2-1-1


After checking "Parent 1" (downward propagation):
☑ Parent 1          ← checked
│
├── ☑ Child 1-1     ← auto-checked
│
└── ☑ Child 1-2     ← auto-checked

☐ Parent 2


After checking only "Child 2-1" (upward propagation):
☐ Parent 1

☐ Parent 2          ← still unchecked (not all children checked)
│
└── ☑ Child 2-1     ← checked
    │
    └── ☑ Grandchild 2-1-1  ← auto-checked


After checking all children of Parent 2:
☑ Parent 2          ← auto-checked (all children now checked)
│
└── ☑ Child 2-1
    │
    └── ☑ Grandchild 2-1-1
```

---

## Key Concepts & Intuition

### 1. Tree Data Structure

```javascript
const treeData = [
  {
    id: 1,
    label: "Parent 1",
    children: [
      { id: 2, label: "Child 1-1" },
      { id: 3, label: "Child 1-2" },
    ],
  },
  {
    id: 4,
    label: "Parent 2",
    children: [
      {
        id: 5,
        label: "Child 2-1",
        children: [
          { id: 6, label: "Grandchild 2-1-1" },
        ],
      },
    ],
  },
];
```

### 2. Flat State Object

```javascript
// Instead of nested state, use flat object
const [checked, setChecked] = useState({
  1: false,  // Parent 1
  2: false,  // Child 1-1
  3: false,  // Child 1-2
  4: false,  // Parent 2
  5: false,  // Child 2-1
  6: false,  // Grandchild 2-1-1
});
```

**Why flat?** Easier to update any node in O(1), avoids deep cloning.

### 3. Initialize State Recursively

```javascript
const getInitialChecked = (nodes) => {
  let checked = {};
  nodes.forEach((node) => {
    checked[node.id] = false;
    if (node.children) {
      checked = { ...checked, ...getInitialChecked(node.children) };
    }
  });
  return checked;
};
```

### 4. Downward Propagation (Set Descendants)

```javascript
const setDescendants = (node, value, checkedState) => {
  checkedState[node.id] = value;
  if (node.children) {
    node.children.forEach((child) => {
      setDescendants(child, value, checkedState);
    });
  }
};
```

**Pattern:** DFS traversal - set current node, then recursively set all children.

### 5. Upward Propagation (Update Ancestors)

```javascript
const updateAncestors = (node, nodes, checkedState) => {
  for (const parent of nodes) {
    // Check if this parent contains the node as direct child
    if (parent.children?.some((child) => child.id === node.id)) {
      // Parent is checked only if ALL children are checked
      checkedState[parent.id] = parent.children.every(
        (child) => checkedState[child.id]
      );
      // Continue upward
      updateAncestors(parent, treeData, checkedState);
    } else if (parent.children) {
      // Search deeper
      updateAncestors(node, parent.children, checkedState);
    }
  }
};
```

**Pattern:** Find parent of changed node, update its state based on children, recurse upward.

### 6. Combined Handler

```javascript
const handleCheck = (node, value) => {
  const newChecked = { ...checked };

  // 1. Set this node and all descendants
  setDescendants(node, value, newChecked);

  // 2. Update all ancestors
  updateAncestors(node, treeData, newChecked);

  setChecked(newChecked);
};
```

---

## Implementation Tips

### 1. Recursive Component

```javascript
function CheckboxTree({ nodes, checked, onCheck }) {
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <label>
            <input
              type="checkbox"
              checked={checked[node.id]}
              onChange={(e) => onCheck(node, e.target.checked)}
            />
            {node.label}
          </label>
          {node.children && (
            <CheckboxTree
              nodes={node.children}
              checked={checked}
              onCheck={onCheck}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
```

### 2. Indeterminate State (Partial Selection)

```javascript
// When some but not all children are checked
const isIndeterminate = (node, checkedState) => {
  if (!node.children) return false;

  const checkedCount = node.children.filter(
    (child) => checkedState[child.id]
  ).length;

  return checkedCount > 0 && checkedCount < node.children.length;
};

// Apply to checkbox
<input
  type="checkbox"
  checked={checked[node.id]}
  ref={(el) => {
    if (el) el.indeterminate = isIndeterminate(node, checked);
  }}
/>
```

### 3. Visual Hierarchy with CSS

```css
.checkbox-tree ul ul {
  padding-left: 24px;
  margin-left: 8px;
  border-left: 1px dashed #ccc;
}
```

---

## Common Interview Questions

### Q1: How would you implement indeterminate state?

```javascript
// Indeterminate = some children checked, but not all
const getNodeState = (node, checkedState) => {
  if (!node.children) {
    return checkedState[node.id] ? 'checked' : 'unchecked';
  }

  const childStates = node.children.map(c => getNodeState(c, checkedState));
  const allChecked = childStates.every(s => s === 'checked');
  const someChecked = childStates.some(s => s === 'checked' || s === 'indeterminate');

  if (allChecked) return 'checked';
  if (someChecked) return 'indeterminate';
  return 'unchecked';
};
```

### Q2: How would you handle async data loading?

```javascript
const [expanded, setExpanded] = useState({});
const [loading, setLoading] = useState({});

const handleExpand = async (node) => {
  if (node.children || loading[node.id]) return;

  setLoading(prev => ({ ...prev, [node.id]: true }));
  const children = await fetchChildren(node.id);

  // Update tree data with loaded children
  updateTreeNode(node.id, { children });
  setLoading(prev => ({ ...prev, [node.id]: false }));
  setExpanded(prev => ({ ...prev, [node.id]: true }));
};
```

### Q3: How would you optimize for 10,000+ nodes?

```javascript
// 1. Virtualization - only render visible nodes
import { VariableSizeList } from 'react-window';

// 2. Flatten tree for virtualized rendering
const flattenTree = (nodes, depth = 0) => {
  return nodes.flatMap(node => [
    { ...node, depth },
    ...(expanded[node.id] && node.children
      ? flattenTree(node.children, depth + 1)
      : [])
  ]);
};

// 3. Memoize expensive calculations
const memoizedFlatten = useMemo(
  () => flattenTree(treeData),
  [treeData, expanded]
);
```

### Q4: How would you implement search/filter?

```javascript
const [filter, setFilter] = useState('');

const filterTree = (nodes, term) => {
  return nodes.reduce((acc, node) => {
    const matchesLabel = node.label.toLowerCase().includes(term.toLowerCase());
    const filteredChildren = node.children
      ? filterTree(node.children, term)
      : [];

    if (matchesLabel || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
      });
    }
    return acc;
  }, []);
};
```

### Q5: How would you add drag-and-drop reordering?

```javascript
const [draggedNode, setDraggedNode] = useState(null);
const [dropTarget, setDropTarget] = useState(null);

const handleDrop = (targetNode) => {
  // Remove from old location
  // Insert at new location
  // Update tree structure
  const newTree = moveNode(treeData, draggedNode, targetNode);
  setTreeData(newTree);
};
```

---

## Edge Cases to Consider

1. **Empty tree** - Handle gracefully
2. **Single node** - No children to propagate
3. **Deep nesting** - 20+ levels deep
4. **Circular references** - Validate tree structure
5. **Duplicate IDs** - Ensure uniqueness
6. **Concurrent updates** - Race conditions
7. **Large trees** - Performance optimization
8. **Accessibility** - Keyboard navigation

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Initialize state | O(n) | O(n) |
| Set descendants | O(k) | O(d) |
| Update ancestors | O(d × b) | O(d) |
| Render tree | O(n) | O(d) |

Where n = total nodes, k = descendants count, d = tree depth, b = branching factor

---

## Performance Optimizations

### 1. Memoize Child Components

```javascript
const TreeNode = React.memo(({ node, checked, onCheck }) => (
  // ...
));
```

### 2. Use Immer for State Updates

```javascript
import produce from 'immer';

const handleCheck = (node, value) => {
  setChecked(produce(draft => {
    setDescendants(node, value, draft);
    updateAncestors(node, treeData, draft);
  }));
};
```

### 3. Batch State Updates

```javascript
// React 18 auto-batches, but for older versions:
import { unstable_batchedUpdates } from 'react-dom';

unstable_batchedUpdates(() => {
  setChecked(newChecked);
  setExpanded(newExpanded);
});
```

---

## File Structure

```
lld-018-checkbox-hierarchy/
├── CheckboxTree.jsx  # Recursive tree component
├── Solution.jsx      # Main app with state logic
├── data.js           # Sample tree data
├── styles.css        # Tree styling
└── problem.md        # This file
```

---

## Real-World Applications

1. **File Systems** - Folder permission checkboxes
2. **E-commerce** - Category filter trees
3. **Admin Panels** - Role/permission management
4. **Settings** - Grouped option toggles
5. **Email** - Folder/label selection
6. **Org Charts** - Department selection
7. **Menu Builders** - Nested menu item selection

---

## Related Patterns

- **Tree Traversal** - DFS, BFS algorithms
- **State Machines** - Checked, unchecked, indeterminate
- **Virtualized Lists** - For large trees
- **Recursive Components** - Self-referencing render
- **Compound Components** - Tree.Node, Tree.Branch
