/**
 * Virtual DOM diff: compare two vnode trees and emit the minimal patch list.
 *
 * vnode = { type, props, children, key? } | string | number
 */
export function diff(oldNode, newNode, path = []) {
  const patches = []

  if (oldNode === newNode) return patches

  // Removal / insertion
  if (oldNode == null) return [{ type: 'CREATE', path, node: newNode }]
  if (newNode == null) return [{ type: 'REMOVE', path }]

  // Text nodes
  if (typeof oldNode !== 'object' || typeof newNode !== 'object') {
    if (oldNode !== newNode) patches.push({ type: 'TEXT', path, value: newNode })
    return patches
  }

  // Heuristic #1: a different element type means REPLACE the whole subtree.
  // React does not attempt to match children across a type change -- the
  // assumption is that a <div> becoming a <span> is a different thing entirely.
  if (oldNode.type !== newNode.type) {
    return [{ type: 'REPLACE', path, node: newNode }]
  }

  const propPatch = diffProps(oldNode.props ?? {}, newNode.props ?? {})
  if (Object.keys(propPatch).length) patches.push({ type: 'PROPS', path, props: propPatch })

  patches.push(...diffChildren(oldNode.children ?? [], newNode.children ?? [], path))
  return patches
}

function diffProps(oldProps, newProps) {
  const out = {}
  for (const key of new Set([...Object.keys(oldProps), ...Object.keys(newProps)])) {
    if (!Object.is(oldProps[key], newProps[key])) out[key] = newProps[key] ?? null
  }
  return out
}

/**
 * Heuristic #2: keys give children stable identity. With keys we can detect a
 * MOVE; without them we can only compare position by position.
 */
function diffChildren(oldChildren, newChildren, path) {
  const keyed = oldChildren.every((c) => c?.key != null) && newChildren.every((c) => c?.key != null)

  if (!keyed) {
    const patches = []
    const max = Math.max(oldChildren.length, newChildren.length)
    for (let i = 0; i < max; i++) {
      patches.push(...diff(oldChildren[i], newChildren[i], [...path, i]))
    }
    return patches
  }

  const patches = []
  const oldByKey = new Map(oldChildren.map((c, i) => [c.key, { node: c, index: i }]))

  newChildren.forEach((child, newIndex) => {
    const prev = oldByKey.get(child.key)
    if (!prev) {
      patches.push({ type: 'CREATE', path: [...path, newIndex], node: child })
      return
    }
    if (prev.index !== newIndex) {
      // The win from keys: reorder instead of destroy + recreate.
      patches.push({ type: 'MOVE', path: [...path, newIndex], key: child.key, from: prev.index })
    }
    patches.push(...diff(prev.node, child, [...path, newIndex]))
    oldByKey.delete(child.key)
  })

  for (const [key, { index }] of oldByKey) {
    patches.push({ type: 'REMOVE', path: [...path, index], key })
  }
  return patches
}

export const h = (type, props = {}, ...children) => ({
  type, props, children: children.flat(), key: props.key,
})
