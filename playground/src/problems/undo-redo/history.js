/**
 * Undo/redo via two stacks.
 *
 * push(state):  undo.push(current); current = state; redo.length = 0
 * undo():       redo.push(current); current = undo.pop()
 * redo():       undo.push(current); current = redo.pop()
 *
 * Clearing redo on a new edit is essential -- once you branch off, the old
 * "future" is unreachable and keeping it would let redo jump to a state that
 * never followed the current one.
 */
export function createHistory(initial, limit = 50) {
  let current = initial
  const undoStack = []
  const redoStack = []

  return {
    get value() { return current },
    get canUndo() { return undoStack.length > 0 },
    get canRedo() { return redoStack.length > 0 },

    push(next) {
      if (next === current) return
      undoStack.push(current)
      if (undoStack.length > limit) undoStack.shift() // bound memory
      current = next
      redoStack.length = 0
    },

    undo() {
      if (!undoStack.length) return current
      redoStack.push(current)
      current = undoStack.pop()
      return current
    },

    redo() {
      if (!redoStack.length) return current
      undoStack.push(current)
      current = redoStack.pop()
      return current
    },
  }
}
