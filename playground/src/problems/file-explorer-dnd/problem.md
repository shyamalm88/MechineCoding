# File Explorer with Drag & Drop

## Problem Statement

Build a **File Explorer** component that renders a nested tree of files and folders, and allows users to **drag any node (file or folder) and drop it into a different folder** to move it.

---

## Requirements

### Functional
- Render a nested file/folder tree recursively
- Click a folder to expand/collapse it
- Drag any file or folder to a different folder to move it
- A folder cannot be dropped into itself or its own descendant

### Non-Functional
- Visual feedback: highlight the drop target while dragging
- Dragged node appears faded while in flight
- Empty folders show a placeholder

---

## Visual Representation

```
📂 root
  📂 public
    📄 index.html       ← drag this...
    📄 robots.txt
  📂 src
    📂 components       ← ...drop here → index.html moves into components
      📄 Header.js
      📄 Footer.js
    📄 App.js
  📄 package.json
```

---

## Key Concepts

### 1. State Design

```
tree       — the full nested tree (single source of truth)
draggedId  — id of the node being dragged (null when idle)
```

Why store only `draggedId` instead of the full node object?
The node already lives in the tree. We don't need a copy — just an id to locate it.

### 2. Drag & Drop — 3 Events That Matter

| Event | Where | What it does |
|---|---|---|
| `onDragStart` | any node | records which node is being dragged |
| `onDragOver` | folder only | calls `e.preventDefault()` to allow drop |
| `onDrop` | folder only | triggers the move with `(draggedId → destinationId)` |

> `e.preventDefault()` in `onDragOver` is mandatory — without it, drop events don't fire.

### 3. Tree Mutation — Two Pure Functions

```
removeNode(tree, id)  → [newTree, removedNode]   // find and extract the node
insertNode(tree, destinationId, node)  → newTree  // append node into target folder
moveNode = removeNode + insertNode + validation
```

All functions return a new tree — never mutate state directly.

### 4. Validation — Prevent Invalid Drops

```
draggedId === destinationId         → can't drop into itself
isDescendant(tree, draggedId, destId) → can't drop into own child/grandchild
```

### 5. stopPropagation — Critical for Nested DnD

```jsx
onDragStart: e.stopPropagation()  // only the innermost node fires dragStart
onDrop: e.stopPropagation()       // only the innermost folder receives the drop
```

Without this, every ancestor folder also fires — causing the wrong node to be
recorded as dragged, or the wrong folder to receive the drop.

---

## Interview Follow-Up Questions

**Q: How would you support dropping a file between nodes (not just into a folder)?**

Track drop position (before/after a node) using `getBoundingClientRect()` on dragOver.
Compare `e.clientY` to the node's midpoint to determine above/below.

**Q: How would you persist the tree to a backend?**

On every successful move, POST the updated tree or just the delta
`{ movedId, destinationId }` to an API. Optimistic update locally, rollback on error.

**Q: How would you handle 10,000+ nodes?**

Virtualize the visible list using `react-window`. Flatten the tree into a visible
array (respecting expand/collapse state), render only the rows in the viewport.

**Q: What if two users move the same file simultaneously?**

Last-write-wins for simple cases. For conflict resolution: operational transforms
or CRDTs — same pattern as collaborative editors.

---

## Complexity

| Operation | Time | Space |
|---|---|---|
| removeNode | O(n) | O(d) — recursion depth |
| insertNode | O(n) | O(d) |
| isDescendant | O(n) | O(d) |
| Full move | O(n) | O(d) |

n = total nodes, d = tree depth
