// ---------------------------------------------------------------------------
// Tree Utilities
// All functions are pure — they return a new tree, never mutate the original.
// The tree shape: { id, name, isFolder, items: [] }
// ---------------------------------------------------------------------------

// Remove a node by id from the tree, return [newTree, removedNode]
// We need the removed node so we can insert it at the new location.
export function removeNode(tree, targetId) {
  let removed = null;

  function recurse(node) {
    if (!node.isFolder) return node;

    const index = node.items.findIndex((item) => item.id === targetId);

    if (index !== -1) {
      // Found the node in this folder's direct children — remove it
      removed = node.items[index];
      return {
        ...node,
        items: node.items.filter((item) => item.id !== targetId),
      };
    }

    // Not a direct child — search deeper
    return {
      ...node,
      items: node.items.map((item) => recurse(item)),
    };
  }

  const newTree = recurse(tree);
  return [newTree, removed];
}

// Insert a node as a child of the folder with destinationId
export function insertNode(tree, destinationId, nodeToInsert) {
  if (tree.id === destinationId) {
    // This is the target folder — append the node to its items
    return {
      ...tree,
      items: [...tree.items, nodeToInsert],
    };
  }

  if (!tree.isFolder) return tree;

  return {
    ...tree,
    items: tree.items.map((item) => insertNode(item, destinationId, nodeToInsert)),
  };
}

// Move a node: remove from old location, insert into new folder
// Returns the updated tree, or null if the move is invalid.
export function moveNode(tree, draggedId, destinationFolderId) {
  // Guard: can't drop a folder into itself or its own descendant
  if (draggedId === destinationFolderId) return null;
  if (isDescendant(tree, draggedId, destinationFolderId)) return null;

  const [treeWithoutDragged, removed] = removeNode(tree, draggedId);
  if (!removed) return null;

  return insertNode(treeWithoutDragged, destinationFolderId, removed);
}

// Check if potentialDescendantId is inside ancestorId
// Used to prevent dropping a folder into its own child
function isDescendant(tree, ancestorId, potentialDescendantId) {
  function findAncestor(node) {
    if (node.id !== ancestorId) return null;
    return node; // found the ancestor
  }

  function searchUnder(node, targetId) {
    if (node.id === targetId) return true;
    if (!node.isFolder) return false;
    return node.items.some((item) => searchUnder(item, targetId));
  }

  // Find the ancestor node first, then check if potentialDescendant is under it
  function findAndCheck(node) {
    if (node.id === ancestorId) {
      return searchUnder(node, potentialDescendantId);
    }
    if (!node.isFolder) return false;
    return node.items.some((item) => findAndCheck(item));
  }

  return findAndCheck(tree);
}
