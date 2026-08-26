# Grid Selection (Drag to Select)

## Problem Statement

Build a **Grid Selection** component that allows users to click and drag to select multiple cells in a grid. This pattern mimics the selection behavior found in spreadsheets (Excel, Google Sheets) and file managers.

This pattern is essential for:
- Spreadsheet applications
- File manager grid views
- Image gallery bulk selection
- Calendar date range pickers
- Seat selection interfaces
- Game board editors

---

## Requirements

### Functional Requirements

1. **Grid Rendering**
   - Render an N x N grid of cells
   - Each cell should be visually distinct

2. **Click and Drag Selection**
   - Mouse down starts selection
   - Mouse move updates selection rectangle
   - Mouse up finalizes selection
   - Only left-click triggers selection

3. **Selection Rectangle**
   - Show visual overlay while dragging
   - Highlight cells within selection area
   - Support selection in any direction (top-left to bottom-right, etc.)

4. **Selection State**
   - Track which cells are selected
   - Highlight selected cells after mouse up
   - Click on empty area to deselect all

5. **Edge Cases**
   - Handle drag outside grid bounds
   - Distinguish between click and drag

### Non-Functional Requirements

- Smooth selection experience (no lag)
- No text selection during drag
- Performant with larger grids
- Works across browsers

---

## Visual Representation

```
Initial State (5x5 Grid):
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+

During Drag (selection rectangle):
+---+---+---+---+---+
|   | ╔═══════╗ |   |
+---+-║-+---+-║-+---+
|   | ║ |   | ║ |   |
+---+-║-+---+-║-+---+
|   | ╚═══════╝ |   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
      ↑ Dashed overlay

After Selection (cells highlighted):
+---+---+---+---+---+
|   |███|███|███|   |
+---+---+---+---+---+
|   |███|███|███|   |
+---+---+---+---+---+
|   |███|███|███|   |
+---+---+---+---+---+
|   |   |   |   |   |
+---+---+---+---+---+
      ↑ Purple/selected cells
```

---

## Key Concepts & Intuition

### 1. Converting Mouse Position to Cell Index

```javascript
const getCellFromEvent = (e) => {
  const rect = gridRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left;  // X relative to grid
  const y = e.clientY - rect.top;   // Y relative to grid
  const col = Math.floor(x / CELL_SIZE);
  const row = Math.floor(y / CELL_SIZE);
  return { row, col };
};
```

**Key insight:** Divide mouse position by cell size to get grid coordinates.

### 2. Selection State Machine

```
IDLE → (mousedown) → SELECTING → (mouseup) → IDLE
                          ↑
                     (mousemove)
```

```javascript
const [selecting, setSelecting] = useState(false);
const [start, setStart] = useState(null);     // {row, col}
const [end, setEnd] = useState(null);         // {row, col}
const [selected, setSelected] = useState([]); // ["0,1", "0,2", ...]
```

### 3. Calculating Selected Cells

```javascript
const handleMouseUp = () => {
  // Get bounding box of selection
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);
  const minCol = Math.min(start.col, end.col);
  const maxCol = Math.max(start.col, end.col);

  // Collect all cells in rectangle
  const newSelected = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
        newSelected.push(`${r},${c}`);
      }
    }
  }
  setSelected(newSelected);
};
```

**Why Math.min/max?** Selection can go any direction - user might drag right-to-left or bottom-to-top.

### 4. Selection Rectangle Overlay

```javascript
{selecting && start && end && (
  <div
    style={{
      position: "absolute",
      left: Math.min(start.col, end.col) * CELL_SIZE,
      top: Math.min(start.row, end.row) * CELL_SIZE,
      width: (Math.abs(end.col - start.col) + 1) * CELL_SIZE,
      height: (Math.abs(end.row - start.row) + 1) * CELL_SIZE,
      background: "rgba(128,0,128,0.2)",
      border: "1px dashed purple",
      pointerEvents: "none",
    }}
  />
)}
```

**Why pointerEvents: none?** Allows mouse events to pass through to the grid.

### 5. Distinguishing Click vs Drag

```javascript
const didDragRef = useRef(false);

const handleMouseDown = (e) => {
  didDragRef.current = false;  // Reset on each mousedown
  // ...
};

const handleMouseMove = (e) => {
  if (!selecting) return;
  didDragRef.current = true;   // Mark as dragged
  // ...
};

const handleGridClick = () => {
  if (didDragRef.current) return;  // Don't reset if was dragging
  setSelected([]);
};
```

---

## Implementation Tips

### 1. Prevent Text Selection

```javascript
<div style={{ userSelect: "none" }}>
  {/* grid */}
</div>
```

### 2. Grid Layout Options

```javascript
// Option 1: Flexbox wrap
<div style={{ display: "flex", flexWrap: "wrap", width: GRID_SIZE * CELL_SIZE }}>
  {cells}
</div>

// Option 2: CSS Grid
<div style={{ display: "grid", gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}>
  {cells}
</div>
```

### 3. Cell Key Format

```javascript
// Use "row,col" string as key
const key = `${row},${col}`;
const isSelected = selected.includes(key);

// Alternative: Use Set for O(1) lookup
const selectedSet = new Set(selected);
const isSelected = selectedSet.has(key);
```

### 4. Boundary Checking

```javascript
// Clamp cell coordinates to grid bounds
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const row = clamp(Math.floor(y / CELL_SIZE), 0, GRID_SIZE - 1);
const col = clamp(Math.floor(x / CELL_SIZE), 0, GRID_SIZE - 1);
```

---

## Common Interview Questions

### Q1: How would you implement multi-selection (Ctrl+click)?

```javascript
const handleMouseUp = (e) => {
  const newSelected = /* calculate cells */;

  if (e.ctrlKey || e.metaKey) {
    // Add to existing selection
    setSelected(prev => [...new Set([...prev, ...newSelected])]);
  } else {
    // Replace selection
    setSelected(newSelected);
  }
};
```

### Q2: How would you implement Shift+click range selection?

```javascript
const lastClickedRef = useRef(null);

const handleCellClick = (row, col, e) => {
  if (e.shiftKey && lastClickedRef.current) {
    // Select range from last clicked to current
    const range = getCellsInRange(lastClickedRef.current, { row, col });
    setSelected(range);
  } else {
    lastClickedRef.current = { row, col };
    setSelected([`${row},${col}`]);
  }
};
```

### Q3: How would you optimize for large grids (1000x1000)?

```javascript
// 1. Virtualization - only render visible cells
import { FixedSizeGrid } from 'react-window';

// 2. Use Set instead of Array for selection
const [selected, setSelected] = useState(new Set());

// 3. Memoize cell rendering
const Cell = React.memo(({ row, col, isSelected }) => (
  <div style={{ background: isSelected ? 'purple' : 'white' }} />
));
```

### Q4: How would you add keyboard navigation?

```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (!focusedCell) return;

    const moves = {
      ArrowUp: { row: -1, col: 0 },
      ArrowDown: { row: 1, col: 0 },
      ArrowLeft: { row: 0, col: -1 },
      ArrowRight: { row: 0, col: 1 },
    };

    const move = moves[e.key];
    if (move) {
      setFocusedCell(prev => ({
        row: clamp(prev.row + move.row, 0, GRID_SIZE - 1),
        col: clamp(prev.col + move.col, 0, GRID_SIZE - 1),
      }));
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [focusedCell]);
```

### Q5: How would you handle touch devices?

```javascript
const handleTouchStart = (e) => {
  const touch = e.touches[0];
  handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY, button: 0 });
};

const handleTouchMove = (e) => {
  const touch = e.touches[0];
  handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
};

// Add to grid element
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleMouseUp}
```

---

## Edge Cases to Consider

1. **Drag outside grid** - Clamp coordinates to valid range
2. **Single click** - Should select one cell or deselect all?
3. **Right-click** - Should trigger context menu, not selection
4. **Rapid clicks** - Debounce or handle appropriately
5. **Window resize** - Recalculate grid boundaries
6. **Scroll during selection** - Handle scroll offset
7. **Touch vs mouse** - Different event handling
8. **Performance** - Large grids need optimization

---

## Complexity Analysis

| Operation | Time | Space |
|-----------|------|-------|
| getCellFromEvent | O(1) | O(1) |
| Calculate selection | O(w × h) | O(w × h) |
| Render grid | O(n²) | O(n²) |
| Check if selected | O(k) or O(1) | O(k) |

Where n = grid size, w/h = selection dimensions, k = selected count

---

## Performance Optimizations

### 1. Use Set for Selection

```javascript
// O(1) lookup instead of O(n)
const [selected, setSelected] = useState(new Set());
const isSelected = selected.has(`${row},${col}`);
```

### 2. Memoize Cells

```javascript
const Cell = React.memo(({ row, col, isSelected }) => (
  <div className={isSelected ? 'selected' : ''} />
));
```

### 3. Throttle Mouse Move

```javascript
const throttledMouseMove = useMemo(
  () => throttle(handleMouseMove, 16), // ~60fps
  []
);
```

---

## File Structure

```
lld-017-grid-selection/
├── Solution.jsx     # Main component with selection logic
├── styles.css       # Grid and cell styling (optional)
└── problem.md       # This file
```

---

## Real-World Applications

1. **Spreadsheets** - Excel, Google Sheets cell selection
2. **File Managers** - Desktop icon selection
3. **Image Editors** - Marquee selection tool
4. **Calendar Apps** - Date range selection
5. **Seat Booking** - Theater/flight seat selection
6. **Game Editors** - Tile map selection
7. **Design Tools** - Multi-element selection

---

## Related Patterns

- **Virtualized Grid** - Render only visible cells
- **Drag and Drop** - Move selected items
- **Lasso Selection** - Free-form selection
- **Touch Gestures** - Pinch, swipe for mobile
