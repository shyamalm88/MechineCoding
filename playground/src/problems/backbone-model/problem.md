# Backbone Model

Implement an observable model: attributes behind `get`/`set`, with change
events. It is a compact test of the observer pattern and of API design.

## Why get/set instead of plain properties

`set` becomes the **single choke point** where change detection, validation, and
event emission happen. With plain properties (`model.name = 'x'`) there is
nowhere to hook — which is exactly why Backbone required the accessor style, and
why Vue 3 later used `Proxy` to get the same interception without the ceremony.

## The behaviours that matter

**Silent when nothing changed.** Setting a value equal to the current one must
emit nothing:

```js
if (!Object.is(this.attributes[key], value)) { ...record change... }
if (changed.length === 0) return this
```

Skipping this causes render loops in any UI bound to the events. `Object.is`
rather than `===` so `NaN → NaN` is correctly treated as unchanged.

**Two event granularities.** `change:name` for a specific attribute and a single
aggregate `change` for the batch. A batched `set({a, b})` should fire **one**
`change`, not one per key — otherwise consumers re-render twice for what was
logically a single transaction.

**`previous(key)`** gives the value before the last change, which is what makes
diff-driven updates and undo possible.

## Unsubscribe

`on` returns a disposer. As with any emitter, requiring `off(event, handler)`
invites the bug where a different function reference is passed and nothing is
removed.

Iterate a **copy** of the listener set when emitting, or a handler that
unsubscribes during dispatch corrupts the iteration.

## Historical note

This is the pattern MVC frameworks were built on before the unidirectional-data-
flow era. Its weakness is that mutations can originate anywhere and cascade
through events, which makes state changes hard to trace — precisely the problem
Flux/Redux set out to solve with a single dispatcher and immutable updates.
