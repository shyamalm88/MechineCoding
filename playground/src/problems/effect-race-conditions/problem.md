# Race conditions in useEffect data fetching

```js
useEffect(() => {
  fetchUser(id).then(setUser)   // ✗
}, [id])
```

Looks fine. It is one of the most common real bugs in React code.

## The failure

Select user 1, then quickly user 2. Two requests are in flight. If request 1 is
slower, it **resolves last** and calls `setUser("User 1")` — so the UI shows
user 1 while the selection says 2.

Nothing errored. Both requests succeeded. The bug is that **the last response to
arrive wins**, rather than the response to the newest request.

## The fix: a cleanup flag

```js
useEffect(() => {
  let ignore = false
  fetchUser(id).then(u => { if (!ignore) setUser(u) })
  return () => { ignore = true }
}, [id])
```

React runs the cleanup for the *previous* effect before running the next one, so
a superseded request marks itself ignorable. This is the pattern the React docs
recommend, and it is deliberately not a cancellation — the request completes,
its result is just discarded.

## Or actually cancel

```js
useEffect(() => {
  const controller = new AbortController()
  fetchUser(id, { signal: controller.signal }).then(setUser).catch(e => {
    if (e.name !== 'AbortError') throw e     // ignore our own cancellation
  })
  return () => controller.abort()
}, [id])
```

This frees the connection and saves server work. The catch matters: an aborted
fetch rejects, and without filtering you show the user an error for something
you cancelled yourself.

## Why this is also the "setState on unmounted component" fix

The same cleanup solves the old warning about updating state after unmount. It
was never really about unmounting — it was about a callback outliving the thing
that scheduled it.

## The broader point

Async + a changing input is always a race. `useEffect` gives you a cleanup
function precisely so you have somewhere to invalidate the previous run. If you
find yourself writing an effect with no cleanup that starts async work, look
again.

React Query, SWR, and RSC all handle this for you — which is a large part of why
they exist.

## Why this is also the "setState on unmounted component" fix

The same cleanup solves the old React warning about updating state after
unmount. That warning was never really about unmounting — it was about a
callback outliving the thing that scheduled it. React 18 removed the warning
precisely because the fix was always the same: invalidate the pending work.

## How to answer this out loud

"Fetching in an effect keyed on an id is a race: select A then B quickly, and if
A's request is slower it resolves last and overwrites B's result. Nothing
errored — the bug is that the last *response* wins instead of the newest
*request*. The fix is the effect's cleanup: set an `ignore` flag so a superseded
run discards its result, or use an AbortController to actually cancel. That same
cleanup is what fixed the old 'setState on an unmounted component' warning."

## Follow-ups to expect

- *Does debouncing fix it?* It reduces the window but does not close it — two
  requests can still be in flight, and network latency isn't bounded by your
  debounce.
- *Why not just check `if (id === currentId)`?* You would be reading a stale `id`
  from the closure; the cleanup flag is per-effect-run, which is what makes it
  correct.
- *What do React Query / SWR do?* Exactly this, plus caching and dedup — which is
  a large part of why they exist.
