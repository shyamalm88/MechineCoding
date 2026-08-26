import { useState } from "react";

// ---------------------------------------------------------------------------
// FileExplorer — recursive component, renders one node (file or folder)
// Props:
//   node           — current tree node { id, name, isFolder, items }
//   onDragStart    — called when this node starts being dragged
//   onDrop         — called when something is dropped ON this folder
//   draggedId      — id of the node currently being dragged (for visual hints)
// ---------------------------------------------------------------------------
export default function FileExplorer({ node, onDragStart, onDrop, draggedId }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const isBeingDragged = node.id === draggedId;

  // --- Drag source handlers ---
  function handleDragStart(e) {
    e.stopPropagation(); // prevent parent nodes from also firing dragStart
    onDragStart(node.id);
  }

  // --- Drop target handlers (folders only) ---
  function handleDragOver(e) {
    if (!node.isFolder) return;
    e.preventDefault();  // required to allow drop
    e.stopPropagation();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.stopPropagation();
    setIsDragOver(false);
  }

  function handleDrop(e) {
    if (!node.isFolder) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDrop(node.id); // tell parent: drop happened on this folder
  }

  const icon = node.isFolder ? (isOpen ? "📂" : "📁") : "📄";

  const className = [
    "tree-node",
    node.isFolder ? "folder" : "file",
    isBeingDragged ? "dragging" : "",
    isDragOver ? "drag-over" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <div
        className={className}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => node.isFolder && setIsOpen((prev) => !prev)}
      >
        <span className="node-icon">{icon}</span>
        <span className="node-name">{node.name}</span>
      </div>

      {/* Render children if folder is open */}
      {node.isFolder && isOpen && (
        <div className="children">
          {node.items.map((child) => (
            <FileExplorer
              key={child.id}
              node={child}
              onDragStart={onDragStart}
              onDrop={onDrop}
              draggedId={draggedId}
            />
          ))}
          {node.items.length === 0 && (
            <div className="empty-folder">empty folder</div>
          )}
        </div>
      )}
    </div>
  );
}
