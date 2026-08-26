# Controlled vs uncontrolled components

## The distinction

**Controlled** — React state is the single source of truth:

```js
<input value={value} onChange={e => setValue(e.target.value)} />
```

**Uncontrolled** — the DOM keeps the value; you read it when needed:

```js
<input defaultValue="hi" ref={inputRef} />
inputRef.current.value
```

## Choosing

Controlled is the default because it enables things that need the value *during*
typing: live validation, formatting as you type (phone numbers, currency),
conditionally enabling a submit button, or driving two inputs from one state.

Uncontrolled is legitimate for simple forms where you only need values on
submit, for very large forms where per-keystroke re-renders hurt, and for
`<input type="file">`, which is **always uncontrolled** — its value is read-only
for security reasons.

## The classic warnings

**"A component is changing an uncontrolled input to be controlled."**
`value={undefined}` on first render (data not loaded yet), then a real string
later. Fix with `value={value ?? ''}`.

**A `value` with no `onChange`** makes the field read-only — React re-renders it
back to the same value on every keystroke. Either add `onChange` or use
`defaultValue`.

## The trap worth knowing

`defaultValue` is only read on **mount**. Changing it later does nothing, which
surprises people trying to reset a form by changing the default. To reset an
uncontrolled input, change the component's `key` to force a remount.
