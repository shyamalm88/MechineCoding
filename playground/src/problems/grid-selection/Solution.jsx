import React, { useState, useRef, useEffect } from "react"; // Import React and hooks

const GRID_SIZE = 5; // 10x10 grid
const CELL_SIZE = 40; // 20px x 20px

export default function App() {
  const [selecting, setSelecting] = useState(false); // Track if user is dragging
  const [start, setStart] = useState(null); // Selection start {row, col}
  const [end, setEnd] = useState(null); // Selection end {row, col}
  const [selected, setSelected] = useState([]); // Array of selected cell keys
  const gridRef = useRef(null); // Ref to grid for mouse position
  const didDragRef = useRef(false);

  // Helper to get cell from mouse event
  const getCellFromEvent = (e) => {
    const rect = gridRef.current.getBoundingClientRect(); // Get grid position
    const x = e.clientX - rect.left; // X relative to grid
    const y = e.clientY - rect.top; // Y relative to grid
    const col = Math.floor(x / CELL_SIZE); // Column index
    const row = Math.floor(y / CELL_SIZE); // Row index
    return { row, col };
  };

  // Mouse down: start selection
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    didDragRef.current = false;
    const cell = getCellFromEvent(e);
    setStart(cell);
    setEnd(cell);
    setSelecting(true);
    setSelected([]); // Reset previous selection
  };

  // Mouse move: update selection
  const handleMouseMove = (e) => {
    if (!selecting) return;
    didDragRef.current = true;
    const cell = getCellFromEvent(e);
    setEnd(cell);
  };

  // Mouse up: finalize selection
  const handleMouseUp = () => {
    if (!selecting) return;
    setSelecting(false);
    if (!start || !end) return;
    // Calculate selected cells
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);
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

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  // Click anywhere resets selection
  const handleGridClick = (e) => {
    if (didDragRef.current) return;
    if (!selecting) {
      setSelected([]);
      setStart(null);
      setEnd(null);
    }
  };

  // Render grid cells
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const key = `${row},${col}`;
      const isSelected = selected.includes(key);
      cells.push(
        <div
          key={key}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            border: "1px solid #000",
            boxSizing: "border-box",
            background: isSelected ? "purple" : "#fff",
            display: "inline-block",
          }}
        />,
      );
    }
  }

  return (
    <div
      ref={gridRef}
      style={{
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        userSelect: "none",
        position: "relative",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleGridClick}
    >
      <div
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {cells}
      </div>
      {/* Optional: Draw selection rectangle */}
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
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}
