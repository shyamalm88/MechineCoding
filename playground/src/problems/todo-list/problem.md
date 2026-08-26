# Todo list

The canonical warm-up. It is graded on the parts people skip, not on getting
items onto the screen.

## Derive, don't duplicate

Filtered lists and counts are **computed from** `todos`, never stored:

```js
const visible = todos.filter(...)          // derived
const remaining = todos.filter(t => !t.done).length
```

Keeping a separate `filteredTodos` in state is the classic mistake — two
sources of truth that drift the moment one update forgets the other.

## Stable ids, not indexes

Deleting an item shifts every later index, so index keys make React reuse the
wrong component instances — a half-typed edit visibly jumps to another row.

## The details that are actually being graded

- **Reject whitespace-only input** (`draft.trim()`), and disable the button
  rather than silently adding an empty item.
- **Empty state** — and ideally two: "no todos at all" reads very differently
  from "no items match this filter".
- **Edit mode**: Enter commits, **Escape cancels**, blur commits. Cancelling is
  the one usually missing.
- Reverting to the original text when an edit is emptied, instead of storing an
  empty todo.
- `aria-label` on the checkbox and delete button — an unlabelled `×` is
  announced as just "button".

## Immutable updates

```js
setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x))
```

Mutating `todo.done = true` and calling `setTodos(todos)` passes the same array
reference, so React bails out and nothing re-renders.

## Follow-ups

Persist to `localStorage`; reorder with drag and drop; optimistic updates
against a server with rollback on failure. If the list grows into the thousands,
virtualise it.
