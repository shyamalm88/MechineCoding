# Chainable calculator

`new Calculator(10).add(5).multiply(2).result()` — the fluent-interface pattern.

## The whole trick

**Every mutator returns `this`.** That is it. The chain is just each call
handing the object back so the next method has a receiver.

A **terminal method** (`result()`) returns the actual value and deliberately
ends the chain — you cannot keep chaining after it, which is the point.

## Class vs closure

The closure version returns an `api` object from each method instead of `this`:

```js
const api = { add: (n) => { value += n; return api }, ... }
```

It avoids `this` entirely, so extracting a method (`const add = c.add`) still
works — with the class version that breaks, because `this` is lost.

## Mutable vs immutable

This implementation **mutates**. That means an instance accumulates state, and
two chains from the same object interfere. An immutable variant returns a *new*
instance each call:

```js
add(n) { return new Calculator(this.value + n) }
```

Slower (an allocation per step) but safe to share and branch. Worth raising the
trade-off — jQuery and lodash chains are mutable, immutable builders are common
in modern APIs.

## Follow-ups

- **Lazy evaluation**: queue the operations and only run them in `result()`,
  which allows optimisation or cancellation.
- **Async chaining** is the hard version — each step returns a thenable, which
  is essentially how promise chains work.
- Error handling mid-chain: throw immediately (as here), or accumulate errors
  and surface them at the terminal call.
