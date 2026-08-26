import { useState } from "react";
import { initialTree } from "./data";
import { moveNode } from "./treeUtils";
import FileExplorer from "./FileExplorer";

// ---------------------------------------------------------------------------
// STATE DESIGN
// - tree: the full nested tree structure (single source of truth)
// - draggedId: id of the node currently being dragged (null when not dragging)
//
// WHY store only draggedId instead of the full dragged node?
// The node already lives in the tree — we don't need a copy.
// We just need to know WHICH node to move when drop fires.
// ---------------------------------------------------------------------------

export default function Solution() {
  const [tree, setTree] = useState(initialTree);
  const [draggedId, setDraggedId] = useState(null);

  // Called when user starts dragging any node
  function handleDragStart(id) {
    setDraggedId(id);
  }

  // Called when user drops onto a folder
  function handleDrop(destinationFolderId) {
    if (!draggedId) return;

    // moveNode handles all validation (can't drop into self, can't drop into descendant)
    const updatedTree = moveNode(tree, draggedId, destinationFolderId);

    if (updatedTree) {
      setTree(updatedTree);
    }

    setDraggedId(null);
  }

  // Reset draggedId if drag ends without a valid drop (e.g. dropped outside)
  function handleDragEnd() {
    setDraggedId(null);
  }

  return (
    <div className="app" onDragEnd={handleDragEnd}>
      <h2>File Explorer</h2>
      <p className="hint">Drag any file or folder and drop it onto a folder to move it.</p>
      <div className="explorer-container">
        <FileExplorer
          node={tree}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          draggedId={draggedId}
        />
      </div>
    </div>
  );
}
