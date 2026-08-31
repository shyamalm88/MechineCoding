import { useCallback, useEffect, useState } from 'react'

/**
 * Revision tracking: each problem gets PASSES checkboxes, so a second look
 * weeks later is recorded separately from the first. Progress is per
 * collection ("dsa" and "problems" never share a key) and lives in
 * localStorage -- these are static pages with no backend, so the browser is
 * the only place to put it.
 */
export const PASSES = 2

const keyFor = (collection) => `revision:${collection}`

/** Read the stored map, tolerating absent/blocked/corrupt storage. */
export function readProgress(collection) {
  try {
    const raw = window.localStorage.getItem(keyFor(collection))
    const parsed = raw ? JSON.parse(raw) : {}
    // Never let a hand-edited or half-written value crash the sidebar.
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * Pure: toggle one pass for one problem, returning a NEW map.
 *
 * Entries that fall back to "nothing ticked" are deleted rather than stored as
 * all-false, so clearing a problem leaves no residue and the map stays small.
 */
export function toggle(progress, id, pass) {
  const current = progress[id] ?? []
  const next = Array.from({ length: PASSES }, (_, i) =>
    i === pass ? !current[i] : Boolean(current[i]),
  )

  const updated = { ...progress }
  if (next.some(Boolean)) updated[id] = next
  else delete updated[id]
  return updated
}

/**
 * Pure: completion over a set of problems.
 *
 * `done` counts fully-revised problems (every pass ticked) -- that is what the
 * ring's percentage reports, so it only fills when the work is actually
 * finished, not merely started. `ticks` is the finer-grained total used for the
 * caption.
 */
export function summarise(progress, problems) {
  const total = problems.length
  let done = 0
  let ticks = 0

  for (const problem of problems) {
    const marks = progress[problem.id] ?? []
    const count = marks.filter(Boolean).length
    ticks += count
    if (count === PASSES) done += 1
  }

  return {
    total,
    done,
    ticks,
    totalTicks: total * PASSES,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  }
}

/** Stateful wrapper: the map plus a toggler that persists on every change. */
export function useProgress(collection) {
  const [progress, setProgress] = useState(() => readProgress(collection))

  // Re-read when switching collections (the two builds are separate apps
  // today, but this keeps the hook honest if that ever changes).
  useEffect(() => setProgress(readProgress(collection)), [collection])

  const togglePass = useCallback(
    (id, pass) => {
      setProgress((current) => {
        const next = toggle(current, id, pass)
        try {
          window.localStorage.setItem(keyFor(collection), JSON.stringify(next))
        } catch {
          // Private mode or a full quota: keep the in-memory state usable
          // rather than throwing away the click.
        }
        return next
      })
    },
    [collection],
  )

  return [progress, togglePass]
}
