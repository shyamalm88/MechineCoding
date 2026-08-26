# Custom JSON.stringify

Easy to start, and full of rules people cannot recite.

## The unserialisable values behave differently by position

```js
JSON.stringify({ a: undefined })   // '{}'        — key dropped
JSON.stringify([undefined])        // '[null]'    — becomes null
JSON.stringify(undefined)          // undefined   — not a string at all!
```

The same applies to **functions** and **symbols**. Arrays substitute `null` to
preserve length; objects drop the key entirely.

## Numbers

```js
JSON.stringify(NaN)        // 'null'
JSON.stringify(Infinity)   // 'null'
JSON.stringify(1n)         // throws TypeError — BigInt is not serialisable
```

JSON has no representation for non-finite numbers, so they degrade to `null` —
silently, which is why `NaN` bugs survive a round trip.

## toJSON is consulted first

```js
JSON.stringify(new Date(0))   // '"1970-01-01T00:00:00.000Z"'
```

`Date` has a `toJSON` method. Any object can define one, and it takes priority
over the default serialisation — that is the extension point.

## Circular references throw

`TypeError: Converting circular structure to JSON`. Detect with a `WeakSet` of
objects currently on the stack, and **remove on the way out** — otherwise the
same object appearing twice as *siblings* (a DAG, not a cycle) falsely throws.

## String escaping

Beyond `"` and `\`, all control characters below `U+0020` must be escaped as
`\uXXXX`. Forgetting this produces invalid JSON that `JSON.parse` rejects.

## Traps not covered here

The real signature is `JSON.stringify(value, replacer, space)` — a replacer
function or key allow-list, and indentation. Property order follows normal JS
key ordering: integer-like keys sort numerically first.
