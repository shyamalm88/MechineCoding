# Call, apply, bind and their polyfills

## The difference

```js
fn.call(thisArg, a, b)     // invoke now, args spread
fn.apply(thisArg, [a, b])  // invoke now, args as an array
fn.bind(thisArg, a)        // invoke LATER, returns a new function
```

`call` and `apply` differ only in how arguments are passed. `bind` is the odd
one out: it does not invoke anything, it returns a permanently-bound copy.

## The implementation trick

There is no direct way to "set `this`". But `obj.fn()` sets `this` to `obj`.
So temporarily attach the function to the target object, call it as a method,
then remove it:

```js
const key = Symbol('fn')     // Symbol so we never collide with a real property
context[key] = this
const result = context[key](...args)
delete context[key]
```

Using a string key like `'fn'` risks overwriting an existing property — and if
the call throws before the `delete`, you have permanently mutated the caller's
object.

## bind

`myBind` does not invoke anything — it returns a function that remembers the
context and the bound arguments, and merges them with the call-time ones:

```js
return fn.apply(context, [...args, ...newArgs])
```

This version does not support `new` on the bound function. A complete answer
also checks `this instanceof bound` so the new instance wins over `thisArg`,
and relinks `bound.prototype` — the standard follow-up.

## Traps

- In non-strict mode, `null`/`undefined` `thisArg` becomes `globalThis`. In
  strict mode it stays `null`.
- Bound arguments are **prepended** to call-time arguments.
- A bound function cannot be re-bound — the first `bind` wins.
