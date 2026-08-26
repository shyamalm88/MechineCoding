# Polyfill for clearAllTimeout

There is no built-in way to cancel every pending timeout, so you have to build
a registry.

## The approach

Monkey-patch `setTimeout` to record each id, and `clearTimeout` to forget it:

```js
globalThis.setTimeout = function (fn, delay, ...args) {
  const id = nativeSetTimeout(() => { pending.delete(id); fn(...args) }, delay)
  pending.add(id)
  return id
}
```

## The detail almost everyone misses

**Remove the id when the timeout fires naturally.** Without the
`pending.delete(id)` inside the wrapper, the registry only ever grows — every
timeout that ever ran stays recorded. On a long-lived page that is an unbounded
leak, and `clearAllTimeout()` then loops over thousands of dead ids.

## Why not just track a max id?

A tempting shortcut:

```js
for (let i = 0; i < maxId; i++) clearTimeout(i)   // ✗
```

It "works" in browsers where ids are sequential integers, but it is not
guaranteed by spec, it is O(maxId), and **in Node `setTimeout` returns a
`Timeout` object, not a number** — so the loop clears nothing.

## Caveats worth stating

- Monkey-patching a global affects **every** consumer, including third-party
  scripts and your framework. It is a debugging or teardown tool, not
  architecture.
- Preserve the return type and extra args: `setTimeout(fn, ms, a, b)` passes
  `a, b` to `fn`.
- The same technique extends to `setInterval`, and libraries usually track both.
- A scoped alternative — a `TimerManager` class you deliberately route calls
  through — avoids touching globals entirely and is the better production answer.
