# Deep-diff two nested JSON objects

Report every path that was added, removed, or changed.

## Iterate the union of keys

```js
const keys = new Set([...Object.keys(before), ...Object.keys(after)])
```

Walking only `before` misses **additions**; walking only `after` misses
**removals**. This is the single most common bug in a first attempt.

## Distinguish "missing" from "undefined"

```js
const inA = key in before      // ✓ presence
const wrong = before[key] !== undefined   // ✗ treats {a: undefined} as absent
```

`{a: undefined}` → `{}` is a genuine removal, and `in` is what detects it.

## Comparison

`Object.is` rather than `===`, so `NaN → NaN` is correctly *unchanged* and
`+0 → -0` correctly *is* a change. Dates need an explicit `getTime()` comparison
or every diff reports them as changed (different object identity).

## Arrays are the hard part

Treating arrays as objects keyed by index means inserting one element at the
front reports **every** index as changed:

```
[a, b, c] → [x, a, b, c]     // index diff says: 0,1,2 changed + 3 added
```

Semantically it was a single insertion. Getting that right needs an LCS
(longest common subsequence) diff — the same algorithm `git diff` uses — or a
keyed comparison when elements have stable ids. Naming this limitation is what
distinguishes a strong answer.

## Uses

Change tracking, audit logs, optimistic-update reconciliation, test assertion
messages, and computing minimal PATCH payloads.
