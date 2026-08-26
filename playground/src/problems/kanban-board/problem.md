# Kanban Board

Three columns of cards, draggable between them, with add and delete.

## Requirements

- Drag a card from one column and drop it into another.
- Add a card to any column; remove any card.
- The dragged card lands in the drop target's column.

## How it works

State is one object keyed by column (`todo`, `inProgress`, `done`), each
holding an ordered array of cards. Moving a card is therefore a remove from one
array plus an insert into another, done immutably so React sees new references.

Dragging uses the **native HTML5 drag-and-drop** API rather than mouse events:
`draggable`, `onDragStart`, `onDragOver`, `onDrop`. The one non-obvious
requirement is that `onDragOver` **must** call `preventDefault()` — without it
the browser refuses to fire a drop, and nothing happens.

The card being dragged is held in a ref/state so the drop handler knows what
moved and where it came from.

## Interview traps

- Omitting `preventDefault()` in `onDragOver` — the single most common cause of
  "my drop handler never runs".
- Mutating the source array with `splice` and reusing the same reference, so
  React skips the re-render.
- HTML5 drag-and-drop does not work on touch devices; a pointer-event based
  implementation is needed for mobile.
