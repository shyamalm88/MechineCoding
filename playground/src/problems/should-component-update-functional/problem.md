# How to implement shouldComponentUpdate in a functional component?

## The direct equivalent

`React.memo` — a higher-order component that skips re-rendering when props are
shallowly equal.

```js
const Row = React.memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.label}</li>
})
```

With a custom comparator, it is a near-exact `shouldComponentUpdate`:

```js
React.memo(Row, (prev, next) => prev.item.id === next.item.id)
```

## The inverted return value — a classic trap

- `shouldComponentUpdate` returns **`true` to re-render**.
- `React.memo`'s comparator returns **`true` when props are equal**, i.e. to
  **skip** rendering.

They are opposites. Copying a `shouldComponentUpdate` body straight into
`React.memo` produces exactly backwards behaviour.

## What memo does not cover

`React.memo` compares **props only**. A component still re-renders when:

- its own state changes,
- a `useContext` value it consumes changes.

There is no functional equivalent to blocking those — which is a deliberate
design decision, not an oversight.

## Why memo often does nothing

```js
<Row item={item} onSelect={() => select(item.id)} />
```

That arrow function is a fresh reference every render, so the shallow compare
always fails and `memo` never skips anything. Object and array literals have the
same problem. `memo` only works if **every** prop is referentially stable — which
is why it usually arrives together with `useCallback`/`useMemo`.
