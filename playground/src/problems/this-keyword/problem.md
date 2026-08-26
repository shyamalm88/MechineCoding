# The 'this' keyword and scope-based questions

`this` is determined by **how a function is called**, not where it is defined —
with one exception (arrow functions).

## The binding rules, in precedence order

1. **`new`** — `this` is the newly constructed object.
2. **Explicit** — `call` / `apply` / `bind`.
3. **Implicit** — `obj.method()`; `this` is `obj`.
4. **Default** — `undefined` in strict mode (and inside modules), `globalThis`
   otherwise.

**Arrow functions ignore all four.** They capture `this` lexically from the
enclosing scope at definition time, and `call`/`bind` cannot change it.

## The bug this causes constantly

```js
const f = obj.method   // just a function reference now
f()                     // `this` is undefined — the object was never attached
```

`this` is bound at the **call site**. Extracting a method (passing it to
`setTimeout`, `map`, or an event listener) severs the connection:

```js
element.addEventListener('click', obj.handleClick)          // ✗ loses this
element.addEventListener('click', () => obj.handleClick())  // ✓
element.addEventListener('click', obj.handleClick.bind(obj)) // ✓
```

This is exactly why class components needed constructor `.bind(this)` calls, and
why class fields (`handleClick = () => {}`) became the idiom.

## Where arrows are wrong

```js
const obj = {
  name: 'x',
  get() { return this.name },        // ✓ 'x'
  bad: () => this.name,              // ✗ `this` is module scope, not obj
}
```

Object literals do **not** create a `this` scope, so an arrow method captures
whatever `this` was outside — usually `undefined` in a module.

Same for prototype methods: an arrow on a prototype never sees the instance.
