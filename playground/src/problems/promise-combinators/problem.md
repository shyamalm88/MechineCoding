# Promise.all, allSettled, race and any

## What each does

| | Resolves when | Rejects when | Result |
|---|---|---|---|
| `all` | **All** fulfil | **Any** rejects (fail-fast) | Array of values |
| `allSettled` | All settle | **Never** | Array of `{status, value/reason}` |
| `race` | First **settles** | First settles as a rejection | That one outcome |
| `any` | First **fulfils** | **All** reject | First fulfilled value / `AggregateError` |

## The details that matter

**Order is by input index, not completion time.** `all` must assign
`results[i] = value`, never `results.push(value)` — otherwise a fast third
promise ends up first in the array.

**Count down, don't compare lengths.** `if (--remaining === 0)` is race-free;
checking `results.length === items.length` breaks with holes and with
`undefined` values.

**Handle the empty iterable.** `all([])` resolves immediately with `[]`;
`any([])` rejects with an `AggregateError`. Forgetting this leaves the promise
pending forever — a hang, not an error, which is far worse to debug.

**`race` needs no bookkeeping.** Once a promise settles, further `resolve`/
`reject` calls are silently ignored, so simply attaching both handlers to every
input is correct.

## race vs any

`race` settles on the first promise to **finish**, even if it rejects. `any`
ignores rejections and waits for the first **success**. Reaching for `race` to
implement a fallback is a classic mistake — the first failure would win.

## Practical note

`race` is how timeouts are usually built:

```js
Promise.race([fetchData(), rejectAfter(5000)])
```

Note the loser keeps running — `race` does not cancel anything.
