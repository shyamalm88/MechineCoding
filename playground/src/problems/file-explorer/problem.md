# File Explorer / Folder Tree

## Problem Statement

Build a **File Explorer** component that displays a hierarchical folder structure with the ability to expand/collapse folders and add new files/folders.

## Requirements

### Core Features
1. Display nested folder/file structure
2. Expand/collapse folders on click
3. Add new folders within existing folders
4. Add new files within folders
5. Visual differentiation between files and folders

### User Interactions
- Click folder → expand/collapse
- Click "Folder +" → add new folder (input appears)
- Click "File +" → add new file (input appears)
- Press Enter in input → create item
- Click outside input (blur) → cancel creation

## Visual Representation

```
📂 root
├── 📁 public (click to expand)
│   ├── 📄 index.html
│   └── 📄 robots.txt
├── 📂 src (expanded)
│   ├── 📁 components
│   │   └── 📄 Header.js
│   └── 📄 App.js
│   [Folder +] [File +]     ← Action buttons
│   ┌─────────────────┐
│   │ 📁 [new folder] │     ← Input for new folder
│   └─────────────────┘
```

## Key Concepts & Intuition

### 1. Recursive Tree Structure

The data structure is **self-referential** - each folder contains items that can themselves be folders:

```javascript
{
  id: "1",
  name: "root",
  isFolder: true,
  items: [                    // Children array
    {
      id: "2",
      name: "src",
      isFolder: true,
      items: [...]            // Nested children
    },
    {
      id: "3",
      name: "index.js",
      isFolder: false,
      items: []               // Files have empty items
    }
  ]
}
```

### 2. Recursive Component Pattern

The `Folder` component renders itself for each child - this is the **recursive component pattern**:

```jsx
function Folder({ explorerData }) {
  return (
    <div>
      {explorerData.name}
      {explorerData.items.map(item => (
        <Folder key={item.id} explorerData={item} />  // Recursion!
      ))}
    </div>
  );
}
```

**Base Case:** When `items` is empty or component is a file
**Recursive Case:** When `isFolder: true` and has items

### 3. Tree Traversal for Mutations

To insert a node, we must **traverse the entire tree** to find the target folder:

```javascript
function insertNode(tree, targetId, newItem, isFolder) {
  // Deep clone to avoid mutation
  const copy = structuredClone(tree);

  function traverse(node) {
    // Found the target folder
    if (node.id === targetId && node.isFolder) {
      node.items.unshift(newItem);
      return true;
    }
    // Keep searching in children
    for (let child of node.items) {
      if (traverse(child)) return true;
    }
    return false;
  }

  traverse(copy);
  return copy;
}
```

### 4. State Lifting Pattern

State is managed at the **top level** (`App`) and passed down via props:

```
      App (holds explorerData state)
        │
        ▼ passes handleInsertNode
      Folder
        │
        ▼ passes handleInsertNode
      Folder (child)
        │
        ▼ calls handleInsertNode(folderId, name, isFolder)
      ...
```

## Implementation Tips

### Component State Structure

```javascript
// Each Folder manages its own UI state
const [expanded, setExpanded] = useState(false);
const [folderState, setFolderState] = useState({
  isVisible: false,  // Is input field shown?
  isFolder: null     // Creating folder or file?
});
```

### Event Propagation

Use `stopPropagation()` to prevent button clicks from triggering folder expand/collapse:

```jsx
<button onClick={(e) => {
  e.stopPropagation();  // Don't expand folder
  handleAdd(true);      // Show folder input
}}>
  Folder +
</button>
```

### Key Press Handling

```javascript
const handleFileName = (e) => {
  if (e.keyCode === 13) {  // Enter key
    handleInsertNode(folderId, e.target.value, isFolder);
    hideInput();
  }
};
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         App                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  explorerData: { id, name, isFolder, items: [...] } │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                   handleInsertNode                           │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              insertNode(tree, id, name)              │   │
│  │                    (Deep Clone)                      │   │
│  │                    (Traverse)                        │   │
│  │                    (Insert)                          │   │
│  │                    (Return new tree)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                   setExplorerData                            │
│                          │                                   │
│                          ▼                                   │
│                    Re-render tree                            │
└─────────────────────────────────────────────────────────────┘
```

## Common Interview Questions

1. **Why use `structuredClone` instead of spread operator?**
   - Spread is shallow - nested objects still share references
   - `structuredClone` creates a true deep copy
   - Ensures immutability for React state updates

2. **Why manage expanded state locally in each Folder?**
   - Each folder independently tracks if it's expanded
   - No need to lift this state - it's purely local UI concern
   - Better performance (only re-renders affected folder)

3. **How would you implement delete?**
   - Similar tree traversal
   - Filter out node with matching ID
   - Return new tree without the deleted node

4. **How would you implement rename?**
   - Find node by ID
   - Update the `name` property
   - Return modified tree

## Edge Cases to Handle

- [ ] Empty folder name - prevent creation
- [ ] Duplicate names - allow or warn?
- [ ] Deep nesting - UI indentation
- [ ] Special characters in names
- [ ] Very long file/folder names

## Potential Extensions

1. **Delete files/folders**
2. **Rename files/folders**
3. **Drag and drop** to move items
4. **Search** within file tree
5. **File icons** based on extension
6. **Lazy loading** for large trees

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| Insert Node | O(n) | O(n) |
| Render Tree | O(n) | O(h) |
| Toggle Expand | O(1) | O(1) |

Where n = total nodes, h = tree height (recursion stack)
