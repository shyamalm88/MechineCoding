# Controlled vs uncontrolled components

## The short answer

The question is simply: **who remembers what the user typed?**

- **Controlled** — React remembers. The input's value comes from state, and
  every keystroke updates that state.
- **Uncontrolled** — the DOM remembers. The browser keeps the value internally
  and you read it out when you need it.

```jsx
// Controlled: React state is the source of truth
<input value={value} onChange={e => setValue(e.target.value)} />

// Uncontrolled: the DOM node is the source of truth
<input defaultValue="hi" ref={inputRef} />
inputRef.current.value   // read it when you actually need it
```

## Why controlled is the default

Because it makes the value available **while the user is typing**, which is what
most real features need:

- validating as they type ("password too short")
- formatting live (phone numbers, currency, card numbers)
- enabling/disabling the submit button based on content
- driving two fields from one piece of state
- clearing the form after submit

With an uncontrolled input, you do not know what is in the box until you go and
read it, so none of the above is straightforward.

## The loop, drawn out

The thing that confuses people is that a controlled input does **not** update
itself. Typing a character does not change what is on screen directly:

```
you type "a"
   → onChange fires with e.target.value === "a"
   → setValue("a")
   → React re-renders
   → <input value="a">  ← only NOW does the character appear
```

The input is a pure reflection of state. That is why forgetting `onChange`
makes the field appear frozen — React keeps rendering it back to the old value
on every keystroke.

## Where uncontrolled is genuinely right

Uncontrolled is not the "wrong" option, and saying so is a mistake:

- **Simple forms** where you only need values on submit — read them from
  `FormData` and skip the state entirely.
- **Very large forms**, where a re-render per keystroke across 50 fields is
  measurable.
- **`<input type="file">` is *always* uncontrolled.** Its value is read-only for
  security — a page must not be able to set which file you are uploading.
- Integrating a non-React widget that manages its own DOM.

Libraries like React Hook Form are popular precisely because they use
uncontrolled inputs under the hood and subscribe only where needed, avoiding
per-keystroke re-renders of the whole form.

## The two warnings you will hit

**"A component is changing an uncontrolled input to be controlled."**

```jsx
const [name, setName] = useState()      // undefined!
<input value={name} onChange={...} />   // React sees value={undefined} → uncontrolled
```

On the first render `value` is `undefined`, so React treats the input as
uncontrolled. When data loads and `name` becomes a string, it flips to
controlled — and React warns because the input just changed category
mid-life.

This happens constantly with data fetched after mount. The fix is to never let
the value be `undefined`:

```jsx
const [name, setName] = useState('')       // ✓ start with a string
<input value={name ?? ''} onChange={...} /> // ✓ or coalesce
```

**A `value` with no `onChange`** makes the field read-only. React re-renders it
back to the same value on every keystroke, so it looks broken. Either add
`onChange`, or use `defaultValue` if you meant it to be uncontrolled, or add
`readOnly` if you meant it to be non-editable.

## The trap worth knowing

**`defaultValue` is only read on mount.** Changing it later does nothing:

```jsx
<input defaultValue={user.name} />   // switching user does NOT update the box
```

This surprises people trying to reset a form. To reset an uncontrolled input,
change the component's `key` to force a remount:

```jsx
<ProfileForm key={user.id} user={user} />
```

Same applies to `defaultChecked` on checkboxes.

## How to answer this out loud

"Controlled means React state holds the value and the input renders from it, so
you can react to every keystroke — validation, formatting, conditional submit.
Uncontrolled leaves the value in the DOM and you read it via a ref or FormData,
which is simpler and avoids a re-render per keystroke. I default to controlled
because most forms need live feedback, but I'd use uncontrolled for large simple
forms — and file inputs are always uncontrolled."

## Follow-ups to expect

- *How do you handle a form with 50 fields?* Uncontrolled + a form library, or
  controlled state kept in a reducer so updates are batched by field.
- *How do you reset a form?* Controlled: set state back to initial. Uncontrolled:
  remount via `key`, or call `form.reset()`.
- *What about checkboxes and selects?* Same distinction — `checked`/`value` with
  a handler versus `defaultChecked`/`defaultValue`.
