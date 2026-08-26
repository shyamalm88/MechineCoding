# How JavaScript works: macrotask vs microtask queue

## The loop

```
run one macrotask
  ▶ drain the ENTIRE microtask queue
    ▶ (render if needed)
      ▶ next macrotask
```

The critical rule: after each macrotask, **all** microtasks run — including
microtasks queued *by* those microtasks — before the next macrotask gets a turn.

## Which queue is which

| Microtasks | Macrotasks |
|---|---|
| `Promise.then/catch/finally` | `setTimeout` / `setInterval` |
| `queueMicrotask` | `setImmediate` (Node) |
| `MutationObserver` | I/O, UI events |
| `await` continuations | `requestAnimationFrame`* |

\* rAF is technically its own phase, running before paint.

## The classic ordering question

```js
console.log('1')
setTimeout(() => console.log('4'), 0)
Promise.resolve().then(() => console.log('3'))
console.log('2')
// 1, 2, 3, 4
```

`setTimeout(…, 0)` does not mean "now" — it means "queue a macrotask", and the
entire microtask queue jumps ahead of it.

## Why it matters practically

**Microtask starvation.** A microtask that queues another microtask forever
blocks rendering and all macrotasks — the tab freezes:

```js
function loop() { Promise.resolve().then(loop) }   // never yields
```

An equivalent `setTimeout` loop is harmless by comparison, because it yields
between iterations.

## Notes

- `await x` is sugar for `x.then(...)`, so code after an `await` resumes as a
  **microtask**.
- `setTimeout(fn, 0)` is clamped to ~4ms after several nested timers.
- Node's `process.nextTick` queue drains *before* the promise microtask queue.
