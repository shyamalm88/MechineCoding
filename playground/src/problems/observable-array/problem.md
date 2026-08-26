# Fire an event when an element is pushed to an array

Two mechanisms, with genuinely different reach.

## 1. Proxy — the complete answer

```js
new Proxy(arr, {
  set(obj, prop, value) { obj[prop] = value; onChange(...); return true },
})
```

A `Proxy` intercepts **every** write, including:

- `arr.push(x)` (which internally sets an index and `length`)
- `arr[5] = x` — a direct index write
- `arr.length = 0` — truncation
- `delete arr[0]`

The `set` trap **must return `true`**, or strict mode throws
`TypeError: 'set' on proxy: trap returned falsish`.

Note `push` fires the trap twice — once for the index, once for `length`. Filter
to real index writes by checking `String(Number(prop)) === prop`.

## 2. Patching the mutator methods

```js
Object.defineProperty(arr, 'push', { value(...args) { ... } })
```

Simpler, and it is what Vue 2 did. But it **cannot see `arr[5] = x`** — which is
precisely the famous Vue 2 caveat that required `Vue.set()`, and precisely why
Vue 3 moved to `Proxy`.

Use `Object.defineProperty` with `enumerable: false` rather than plain
assignment, so the patched method does not show up in `for...in`.

## Choosing

| | Proxy | Method patching |
|---|---|---|
| Index assignment | ✓ | ✗ |
| `length` changes | ✓ | ✗ |
| Works on existing reference | ✗ (new object) | ✓ (mutates in place) |
| Performance | Slower per access | Native speed |

The Proxy returns a **new object** — the original array is unchanged, so anyone
holding the old reference bypasses observation entirely. Method patching mutates
in place, which is why it worked for Vue 2's `data`.
