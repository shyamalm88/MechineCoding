# React Strict Mode — why effects run twice

## What you observe

In development, `<StrictMode>` deliberately:

- renders components **twice**
- runs `useEffect` **setup → cleanup → setup**
- double-invokes `useState` initialisers, `useMemo`, and reducers

Production is unaffected. This is intentional, not a bug.

## Why

**Double render** surfaces impure render functions. If rendering mutates
something outside itself, doing it twice produces visibly wrong results — the
bug is exposed immediately rather than at some future point when React decides
to re-render for its own reasons.

**Setup → cleanup → setup** simulates a component being unmounted and remounted
with its state preserved. That is exactly what happens with future features like
Offscreen/Activity, and it forces every effect to have a **correct cleanup**.

## The bugs it catches

```js
// ✗ leaks: a second subscription with no way to remove the first
useEffect(() => { socket.connect() }, [])

// ✓
useEffect(() => {
  socket.connect()
  return () => socket.disconnect()
}, [])
```

Same for intervals, event listeners, observers, and in-flight fetches (which
need an `AbortController` or an ignore flag to avoid setting state after
unmount).

## The mistake people make

Deleting `<StrictMode>` because "my effect fires twice". The double-fire is the
messenger. If running an effect twice breaks the app, the app is broken in
production too — the bug is just harder to reproduce there.

The correct fix is always: make the effect idempotent by writing the cleanup.
