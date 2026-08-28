# HOCs, render props, and hooks — the evolution of logic reuse

## The short answer

All three solve the same problem: **share stateful logic between components**.
Hooks won because they compose flatly, but the older patterns are not dead —
they solve a different half of the problem.

Being able to narrate this progression, and say *why* each was replaced, is the
real question.

## 1. Higher-order components

```jsx
const withUser = (Component) => (props) => {
  const user = useUserSomehow()
  return <Component {...props} user={user} />
}
export default withUser(withTheme(withRouter(Profile)))
```

**The problems:**

- **Wrapper hell** — DevTools shows five nested wrappers around your component.
- **Prop collisions** — compose two HOCs that both inject `data` and one
  silently wins. There is no error; you just get the wrong value.
- **Invisible origins** — looking at `Profile`, where does `user` come from? You
  have to trace the export.
- Static methods and refs need manual hoisting and forwarding.
- Typing generic HOCs is genuinely painful.

## 2. Render props

```jsx
<Mouse render={({ x, y }) => <Cursor x={x} y={y} />} />
```

Fixed the naming collisions and made data flow **explicit** — you can see where
`x` comes from at the call site.

**But:**

- **Pyramid of doom** when nesting several producers:

```jsx
<Mouse render={m => <Scroll render={s => <Size render={z => …} />} />} />
```

- Every render creates a new function, defeating memoisation of the child.

## 3. Hooks

```jsx
const { x, y } = useMouse()
const user = useUser()
const theme = useTheme()
```

Flat. No wrappers, no collisions (you destructure and rename), trivially typed,
and composable in any combination. Three concerns, three lines, no nesting.

**The cost:** the rules of hooks (call order — see Custom Hooks), and hooks
cannot be used by class components.

## Where the older patterns still live

This is the part that shows real understanding:

**HOCs** persist in library APIs that must *wrap*: `React.memo`, `forwardRef`,
Redux's `connect`, error-boundary wrappers (boundaries are still classes).

**Render props / children-as-function** persist wherever the consumer must
control **what is rendered**, not merely receive data:

```jsx
<FixedSizeList itemCount={1000} height={400}>
  {({ index, style }) => <Row style={style} item={items[index]} />}
</FixedSizeList>
```

The library owns *when* and *where* rows render; you own *what* a row looks
like. A hook cannot express that — it can hand you data, but it cannot hand you
a rendering slot.

**The crisp distinction: hooks share *logic*; render props share *rendering
control*.** That is the answer to "are render props obsolete?" — no, they solve
a different problem.

## The modern default

**Custom hook for logic + compound components for structure:**

```jsx
<Tabs defaultValue="a">
  <Tabs.List><Tabs.Trigger value="a">One</Tabs.Trigger></Tabs.List>
  <Tabs.Panel value="a">…</Tabs.Panel>
</Tabs>
```

The consumer controls markup and styling; the library owns state and
accessibility via a private context. This is how Radix, Headless UI and Reach
are built.

## How to answer this out loud

"All three share stateful logic. HOCs wrap and inject props, which gives you
wrapper hell and silent prop collisions when you compose them. Render props
fixed the naming problem and made data flow explicit, but nest badly. Hooks are
flat and composable, which is why they won. But render props aren't obsolete —
hooks share logic, render props share *rendering control*, which is why
virtualisation libraries still use children-as-function. Today I'd reach for a
custom hook plus compound components."

## Follow-ups to expect

- *Why can't hooks replace render props entirely?* They cannot give the caller
  control over what gets rendered inside a library-managed structure.
- *When would you still write an HOC?* Cross-cutting wrapping — error
  boundaries, `memo`, instrumentation.
- *What is a compound component?* Related components sharing implicit state via
  a private context.
