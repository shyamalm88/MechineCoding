# promisify (callback → promise)

Convert a Node-style callback API into one that returns a promise.

## The convention it depends on

**Error-first callbacks**: the callback is the *last* argument and is called as
`(error, value)`. `promisify` only works because that convention is near-
universal in Node — an API with the callback first, or one that calls back with
`(value)` and no error slot, needs a custom wrapper.

```js
fn.call(this, ...args, (error, ...values) => {
  if (error) return reject(error)
  resolve(values.length > 1 ? values : values[0])
})
```

## Three details that get missed

**Forward `this`.** Using `fn(...)` instead of `fn.call(this, ...)` breaks
method usage — `promisify(obj.method)` loses its receiver, exactly as with any
detached method.

**Multiple callback values.** Some APIs call back with `(err, a, b)`. A promise
resolves with one value, so collapse extras into an array. Node's own
`util.promisify` handles this via a `custom` symbol the API can define.

**Falsy errors in `callbackify`.** If a promise rejects with `undefined` or
`null`, passing that straight to `callback(error)` looks like *success* to
every error-first consumer. Substitute a real `Error`.

## Why it still matters

Plenty of older APIs and browser primitives are callback-based, and mixing
styles is where "callback hell" comes from. Promisifying at the boundary lets
everything above it use `async/await`.

`util.promisify` ships in Node; most `fs` functions also have `fs.promises`
equivalents now. Knowing the mechanism explains what those are doing.

## Related

The inverse, `callbackify`, exists for the opposite migration — exposing a
promise-based implementation to callers that still expect callbacks.
