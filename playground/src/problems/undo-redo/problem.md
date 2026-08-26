# Undo/redo system for a text input editor

## Two stacks

```
undoStack ── current ── redoStack
```

- **edit**: push `current` onto undo, set the new value, **clear redo**
- **undo**: push `current` onto redo, pop from undo
- **redo**: push `current` onto undo, pop from redo

## The rule people forget

**A new edit must clear the redo stack.** Once you undo and then type something
different, you have branched — the old future is unreachable. Keeping it would
let redo jump to a state that never followed the current one, corrupting the
document.

## Snapshot vs command

This implementation stores **full snapshots**, which is simple and obviously
correct. For a large document that is memory-hungry.

The alternative is the **Command pattern**: store the *operation* plus enough
information to invert it (`{type:'insert', at:5, text:'abc'}`). Undo applies the
inverse. Far more compact, and it is what real editors and collaborative systems
use — but every command needs a correct inverse, which is where bugs live.

## Coalescing

Pushing a snapshot per keystroke means undo removes one character at a time,
which users find tedious. Real editors **coalesce** consecutive similar edits
into one entry — typically by time window (edits within ~500ms) or by breaking
on word boundaries.

## Traps

- Unbounded history leaks memory; cap it (this one shifts off the oldest).
- Undo must restore **cursor position** too, not just text — otherwise the caret
  jumps to the end.
- Native inputs have their own undo stack; programmatically setting `value`
  desynchronises it, which is why editors intercept the keyboard shortcuts.
