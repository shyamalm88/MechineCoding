import { useState, useEffect } from 'react'

/**
 * Serialise one key into a location-hash query string. Values equal to their
 * default are DELETED rather than written, so a pristine view keeps a clean URL
 * and only the filters you actually touched show up.
 *
 * Pure and exported so it can be tested without a DOM.
 */
export function nextHash(hash, key, value, initial) {
  const params = new URLSearchParams(hash.replace(/^#/, ''))

  if (value == null || value === '' || value === initial) params.delete(key)
  else params.set(key, String(value))

  const query = params.toString()
  return query ? `#${query}` : ''
}

/**
 * useState, but mirrored into the URL hash so filters and the open problem
 * survive a reload (and can be shared or bookmarked).
 *
 * The hash is the single source of truth on first paint; afterwards each hook
 * rewrites only its own key, reading the live hash each time, so several of
 * these compose without clobbering one another. replaceState (not pushState)
 * keeps the back button meaning "leave the app" rather than "undo one filter".
 */
export function useHashParam(key, initial) {
  const [value, setValue] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get(key) ?? initial,
  )

  useEffect(() => {
    const hash = nextHash(window.location.hash, key, value, initial)
    window.history.replaceState(
      null,
      '',
      hash || window.location.pathname + window.location.search,
    )
  }, [key, value, initial])

  return [value, setValue]
}
