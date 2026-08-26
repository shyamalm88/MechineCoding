# Deep clone an object (and the JSON pitfalls)

## Why not JSON.parse(JSON.stringify(obj))

It is the one-liner everyone reaches for, and it silently corrupts data:

| Input | After JSON round-trip |
|---|---|
| `undefined` value | **Key removed entirely** |
| `Date` | ISO **string** |
| `RegExp` | `{}` |
| `Map` / `Set` | `{}` |
| `NaN`, `Infinity` | `null` |
| `function` | Key removed |
| `BigInt` | **Throws** |
| Circular reference | **Throws** |
| `Symbol` key/value | Removed |
| Prototype | Lost — becomes a plain object |

It is fine for plain JSON-shaped data, and genuinely wrong for anything else.

## The manual implementation

Two things carry the weight:

**1. A `WeakMap` for circular references.** Register the clone *before*
recursing into children, so revisiting the same source returns the existing
clone rather than looping forever.

```js
seen.set(value, out)   // BEFORE the recursive calls
```

`WeakMap` (not `Map`) so cloned objects can still be garbage collected.

**2. `Reflect.ownKeys`** rather than `for...in` or `Object.keys`. It includes
**symbol keys and non-enumerable properties**, and it does not walk the
prototype chain — which `for...in` does.

## structuredClone

The modern built-in:

```js
const copy = structuredClone(original)
```

Handles Dates, Maps, Sets, ArrayBuffers, and circular references natively.
It **cannot** clone functions, DOM nodes, or symbols (it throws
`DataCloneError`), and it drops the prototype — a class instance comes back as
a plain object.

Knowing `structuredClone` exists, and precisely where it still falls short, is
the strongest possible answer here.
