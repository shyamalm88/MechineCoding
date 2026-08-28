# How to implement shouldComponentUpdate in a functional component?

## The short answer

`React.memo`. It wraps a component and **skips re-rendering when the props are
shallowly equal** to last time.

```jsx
const Row = React.memo(function Row({ item, onSelect }) {
  return <li onClick={() => onSelect(item.id)}>{item.label}</li>
})
```

With a custom comparator it becomes a near-exact `shouldComponentUpdate`:

```jsx
React.memo(Row, (prevProps, nextProps) => prevProps.item.id === nextProps.item.id)
```

## The inverted return value — the classic trap

This is the detail interviewers listen for, because copying a class method
straight across produces **exactly backwards** behaviour:

| | Returns `true` when… |
|---|---|
| `shouldComponentUpdate` | **re-render** |
| `React.memo` comparator | props are **equal**, so **skip** |

They are opposites. `shouldComponentUpdate` answers *"should I update?"*;
memo's comparator answers *"are these the same?"*. Getting it wrong gives you a
component that re-renders only when nothing changed.

## What "shallowly equal" actually means

React compares each prop with `Object.is`, one level deep:

```js
prevProps.item === nextProps.item     // reference comparison, not deep
```

So a prop that is a **new object or array or function each render** always
compares unequal, and memo never skips anything.

## Why memo usually does nothing

This is the most common real-world outcome:

```jsx
<Row
  item={item}
  style={{ margin: 4 }}              // ✗ new object every render
  onSelect={() => select(item.id)}   // ✗ new function every render
/>
```

You pay for the comparison and get zero benefit. `React.memo` only works when
**every** prop is referentially stable, which is why it almost always arrives
together with `useCallback` and `useMemo`:

```jsx
const handleSelect = useCallback((id) => select(id), [])
const style = useMemo(() => ({ margin: 4 }), [])
<Row item={item} style={style} onSelect={handleSelect} />
```

If you are not prepared to stabilise every prop, adding `memo` is cargo cult.

## What memo does NOT cover

`React.memo` compares **props only**. The component still re-renders when:

- its **own state** changes (`useState`, `useReducer`)
- a **context** it consumes changes

There is no functional equivalent to blocking those, and that is deliberate —
state and context changes are how a component learns it must update. If a
context change is re-rendering too much, the fix is splitting the context, not
memoising.

## Worked example: when it actually pays

```jsx
function List({ items, query }) {
  return items.map(item => <Row key={item.id} item={item} />)
}
```

Typing in the search box re-renders `List` on every keystroke, which re-renders
all 500 `Row`s — even though the row data has not changed. Wrapping `Row` in
`memo` means only the rows whose `item` reference actually changed re-render.

That is the shape where memo earns its keep: **a big list, a parent that
re-renders often for unrelated reasons, and stable item references.**

## The alternative people forget

Composition can beat memoisation entirely. An element passed as `children` is
created by the *parent*, so its reference does not change when the intermediate
component re-renders:

```jsx
function Layout({ children }) {
  const [open, setOpen] = useState(false)   // toggling does NOT re-render children
  return <div>{children}</div>
}
```

No `memo`, no `useCallback`, same result.

## How to answer this out loud

"`React.memo` is the equivalent — it does a shallow prop comparison and skips
the render if nothing changed. The gotcha is that the comparator is inverted
relative to `shouldComponentUpdate`: returning true means 'equal, skip', not
'please update'. And memo only helps if every prop is referentially stable, so
in practice it comes with `useCallback`/`useMemo` — otherwise the shallow
compare always fails and you've just added cost."

## Follow-ups to expect

- *Does memo stop re-renders from context?* No — props only.
- *Is memo free?* No: you pay a shallow comparison every render, plus retained
  memory. Profile before adding it.
- *What about the React Compiler?* It auto-memoises, making most manual `memo`
  unnecessary — but the underlying reasoning about referential identity is
  exactly what it automates.
