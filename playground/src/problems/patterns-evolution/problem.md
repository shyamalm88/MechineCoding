# HOCs, render props, and hooks — the evolution of logic reuse

All three solve one problem: **share stateful logic between components.** The
progression is worth being able to narrate.

## 1. Higher-order components

```js
const withUser = (Component) => (props) => {
  const user = useUserSomehow()
  return <Component {...props} user={user} />
}
export default withUser(Profile)
```

**Problems:** wrapper hell in DevTools; prop-name collisions when composing two
HOCs that both inject `data`; the source of a prop is invisible at the call
site; static methods and refs need manual hoisting/forwarding; typing generic
HOCs is painful.

## 2. Render props

```jsx
<Mouse render={({ x, y }) => <Cursor x={x} y={y} />} />
```

Fixed the naming collisions and made the data flow explicit — you can *see*
where `x` comes from. But nesting several producers gives the "pyramid of doom",
and every render creates a new function, defeating memoisation of the child.

## 3. Hooks

```js
const { x, y } = useMouse()
const user = useUser()
```

Flat, composable, no wrapper components, no naming collisions (you destructure
and rename), and trivially typed. This is why hooks won.

The cost: the **rules of hooks** (call order — see Custom Hooks), and the fact
that hooks can only be used by components, not class code.

## Where the older patterns still appear

- **HOCs** in library APIs that must wrap: `React.memo`, `forwardRef`,
  `connect`, error-boundary wrappers (boundaries are still classes).
- **Render props / children-as-function** where the consumer must control
  *what is rendered*, not just receive data — virtualisation libraries
  (`react-window`), `<Downshift>`, and headless components.

Hooks share **logic**; render props share **rendering control**. That distinction
is the crisp answer to "are render props obsolete?" — no, they solve a different
half of the problem.

## The modern default

Custom hook for logic + compound components for structure. See Composition and
Prop Drilling for the compound-component pattern.
