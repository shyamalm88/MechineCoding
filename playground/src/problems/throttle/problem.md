# Implement throttle

`throttle(fn, wait)` returns a function that calls `fn` **at most once per
`wait` ms**, no matter how often it is invoked.

## Throttle vs debounce

The single most common interview follow-up:

- **Throttle** fires at a steady maximum rate *during* continuous activity.
  Use for scroll position, mousemove, resize, or a firing button in a game.
- **Debounce** waits for activity to *stop*, then fires once.
  Use for search-as-you-type, autosave, or validating after typing.

Scroll handlers must throttle: debouncing means nothing happens until the user
stops scrolling, which is exactly when you no longer need the update.

## Leading and trailing edges

- **Leading**: fire immediately on the first call. Feels responsive.
- **Trailing**: fire once more at the end of the window, so the final call in a
  burst is not lost.

This implementation does both. A leading-only throttle silently discards the
last event of a burst — for a scroll handler that means the final position is
never recorded, leaving the UI slightly wrong.

## Traps

- Using `setInterval` instead of tracking timestamps drifts and keeps firing
  after activity stops.
- Forgetting `fn.apply(this, args)` breaks method usage and drops arguments.
- Recreating the throttled function on every React render resets its internal
  timestamp, so it never actually throttles — memoise it.
