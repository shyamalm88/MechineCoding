/**
 * Given a node in tree A, find the corresponding node in an identical tree B.
 *
 * Key insight: the two trees have the same SHAPE, so the position of a node --
 * its chain of child indices from the root -- uniquely identifies it. No ids,
 * no attributes, no content comparison needed.
 */

/** Walk up to the root recording the index of each node within its parent. */
export function getPath(root, node) {
  const path = []
  let current = node
  while (current && current !== root) {
    const parent = current.parentNode
    if (!parent) return null
    path.unshift([...parent.children].indexOf(current))
    current = parent
  }
  return current === root ? path : null
}

/** Replay a path from the other root. */
export function followPath(root, path) {
  return path.reduce((node, index) => node?.children[index], root)
}

export function findMirror(rootA, rootB, target) {
  const path = getPath(rootA, target)
  return path && followPath(rootB, path)
}

/**
 * Alternative: walk both trees in lockstep. Same O(n) worst case but does not
 * need parent pointers -- useful when the "tree" is a plain data structure.
 */
export function findMirrorLockstep(a, b, target) {
  if (a === target) return b
  for (let i = 0; i < a.children.length; i++) {
    const found = findMirrorLockstep(a.children[i], b.children[i], target)
    if (found) return found
  }
  return null
}
