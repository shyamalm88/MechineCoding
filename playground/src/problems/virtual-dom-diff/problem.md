# Virtual DOM tree diff

Compare two vnode trees and emit a patch describing what changed. This is the
reconciliation half of a framework.

A vnode is `{ type, children[] }` or a string (text).

## Why O(n) and not O(n³)

The general tree-edit-distance problem is **O(n³)** — unusable. React gets O(n)
by making assumptions and accepting the cases they get wrong:

**Heuristic 1 — different type ⇒ replace the whole subtree.**
`<div>` becoming `<span>` tears down everything inside and rebuilds it, without
attempting to match children. Cheap, and almost always what you meant.

**Heuristic 2 — children are compared by position.**
This version walks `old.children[i]` against `new.children[i]`. Insert an item
at the front and every position mismatches, so the entire list is rewritten.
Real React uses `key`s to give children stable identity and turns that into
moves — which is why index keys are a bug: they make the key *equal* to the
position and throw the identity away.

## The patch types

| Patch | When |
|---|---|
| `CREATE` | node exists only in the new tree |
| `REMOVE` | node exists only in the old tree |
| `REPLACE` | text changed, or the type differs |
| `UPDATE_CHILDREN` | same type; carries `childPatches: [{ index, patch }]` |
| `null` | no change at this position |

`diff` returns `null` when nothing differs, so unchanged subtrees produce no
patch at all.

## Applying a patch

`applyPatch(root, patch)` walks the same shape. Two details:

- **Apply child patches in descending index order.** `CREATE` and `REMOVE`
  splice the children array and shift every later index; going high-to-low means
  a splice never invalidates an index you have not used yet.
- **Wrap the root in a synthetic parent** so a root-level `CREATE`/`REMOVE`/
  `REPLACE` reuses the same splice logic as every other position.

The "mounted" tree is a deep clone (`cloneTree`) — like a real DOM, it must be a
separate structure from the vnode literals.

## Not covered

- **Props/attributes** — this diff only handles type, text and children.
- **Keyed moves** — needs a key map, plus a two-ended comparison (React/Vue walk
  from both ends) to make prepend/append cheap.
- Component boundaries — this diff only covers host elements.

## The bigger point

Diffing is not free — it is a trade. You spend CPU comparing objects to avoid
touching the DOM, which is more expensive still. Svelte and Solid skip it
entirely by compiling precise updates, which is why "the virtual DOM is fast"
is the wrong framing: it is a *predictable* way to get declarative UI.
