// Super simple Virtual DOM tree diff

function diff(oldTree, newTree) {
  if (!oldTree) return newTree; // New node? Create it.

  if (!newTree) return null; // Gone? Remove it.

  if (oldTree.type !== newTree.type) {
    return newTree; // Types differ? Replace wholesale.
  }

  // TODO: Patch props here if they changed (e.g., compare old/new props)

  const patchedKids = [];
  const maxKids = Math.max(oldTree.children.length, newTree.children.length);

  for (let i = 0; i < maxKids; i++) {
    const kidPatch = diff(oldTree.children[i], newTree.children[i]);
    if (kidPatch) patchedKids.push(kidPatch);
  }

  return { ...newTree, children: patchedKids }; // Return patched version
}
