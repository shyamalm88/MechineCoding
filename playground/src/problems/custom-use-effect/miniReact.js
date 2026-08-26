/**
 * A miniature hooks runtime, to show WHY the rules of hooks exist.
 *
 * Hooks are identified by CALL ORDER, not by name: each component instance
 * keeps an array of state cells and a cursor that resets before every render.
 */
export function createHookRuntime(render) {
  const cells = []
  let cursor = 0
  let scheduled = false

  const rerender = () => {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {           // batch multiple setState calls in a turn
      scheduled = false
      cursor = 0                     // ← the reset that makes call order work
      render()
      runEffects()
    })
  }

  const pendingEffects = []

  function useState(initial) {
    const i = cursor++
    if (!(i in cells)) cells[i] = { value: typeof initial === 'function' ? initial() : initial }
    const cell = cells[i]
    const setState = (next) => {
      const value = typeof next === 'function' ? next(cell.value) : next
      if (Object.is(value, cell.value)) return   // bail out on no-op updates
      cell.value = value
      rerender()
    }
    return [cell.value, setState]
  }

  function useEffect(effect, deps) {
    const i = cursor++
    const prev = cells[i]
    // undefined deps ⇒ always run; [] ⇒ once; [a,b] ⇒ when any changes
    const changed = !prev || !deps || deps.some((d, j) => !Object.is(d, prev.deps[j]))
    if (changed) {
      pendingEffects.push(() => {
        prev?.cleanup?.()                    // cleanup BEFORE the next setup
        const cleanup = effect()
        cells[i] = { deps, cleanup }
      })
    }
    if (!changed) cells[i] = prev
  }

  function useMemo(factory, deps) {
    const i = cursor++
    const prev = cells[i]
    if (prev && deps && deps.every((d, j) => Object.is(d, prev.deps[j]))) return prev.value
    const value = factory()
    cells[i] = { value, deps }
    return value
  }

  function runEffects() {
    while (pendingEffects.length) pendingEffects.shift()()
  }

  function mount() { cursor = 0; render(); runEffects() }

  return { useState, useEffect, useMemo, mount, _cells: cells }
}
