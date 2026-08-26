# Find the matching element in a mirrored DOM tree

Given two structurally identical trees and a node in the first, return the
corresponding node in the second.

## The key insight

The trees have the **same shape**, so a node's *position* uniquely identifies
it. Nothing about its content, id, class, or text is needed — and relying on
those would be wrong, since the exercise permits identical siblings.

## Approach 1: path of indices

Walk up to the root recording each node's index within its parent, then replay
that path from the other root:

```js
path.unshift([...parent.children].indexOf(current))   // going up
path.reduce((node, i) => node.children[i], rootB)      // coming down
```

Cost is O(depth × siblings) up, O(depth) down — effectively O(depth) for
realistic trees. This is the better answer when you already hold the target
node, because it never touches the rest of the tree.

## Approach 2: lockstep traversal

Walk both trees together and return B's node when A's matches the target:

```js
if (a === target) return b
for (let i = 0; i < a.children.length; i++) { ... }
```

O(n) over the whole tree, but it needs no parent pointers — the right choice
when the structure is plain data rather than DOM.

## Traps

- **`children` vs `childNodes`.** `childNodes` includes text nodes, so any
  whitespace in the markup shifts every index and the mirror is wrong.
  `children` is elements only.
- Stopping at `document` instead of the given root produces paths that cannot be
  replayed.
- If the trees are *not* guaranteed identical, index replay silently returns the
  wrong node or `undefined` — validate, or fall back to a structural diff.

## Why it is asked

It tests whether you reach for structure over content, and whether you know the
`children`/`childNodes` distinction. It is also a real problem: split-pane
diff views, synchronised scrolling, and editor/preview highlighting all do this.
