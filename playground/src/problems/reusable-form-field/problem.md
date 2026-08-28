# Implement a reusable form field component with validation

## The short answer

A field component bundles the things that always travel together — **label,
input, hint, error, and the ARIA wiring that links them** — so every form in the
app gets them right by default.

```jsx
function Field({ id, label, error, hint, ...inputProps }) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={[hint && hintId, error && errorId]
          .filter(Boolean).join(' ') || undefined}
        {...inputProps}
      />
      {hint  && <p id={hintId}>{hint}</p>}
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  )
}
```

## The accessibility wiring is the point

This is the part usually missed, and it is what makes the component worth
extracting:

| Attribute | Why |
|---|---|
| `htmlFor` / `id` | Clicking the label focuses the input; screen readers announce the name |
| `aria-describedby` | Associates the hint and error text with the input |
| `aria-invalid` | Communicates the error *state*, not just red text |
| `role="alert"` | Announces the error when it appears |

Without `aria-describedby`, a screen-reader user hears "Email, edit text" and
never learns why it was rejected. Red border alone communicates nothing to
them — or to anyone with a colour-vision deficiency.

Note the `|| undefined`: an empty `aria-describedby=""` is invalid, so the
attribute must be omitted entirely when there is nothing to describe.

## Validation timing — a UX decision

Validating on every keystroke shouts at users while they are still typing.
Typing `a` into an email field and immediately seeing "invalid email" is
hostile.

The standard compromise:

1. **Do not validate an untouched field.**
2. **Validate on blur** — they have finished with it.
3. **After it has been touched, re-validate on change** — so the error clears
   as soon as they fix it.

That requires tracking a `touched` flag per field, not just value and error:

```js
{ value: '', error: null, touched: false }
```

Forgetting `touched` is why so many forms show errors on a pristine form.

## Composition over configuration

Resist growing one component with `type`, `options`, `multiline`, `mask`,
`prefix`… props. That component becomes unmaintainable.

Keep the shared wrapper and let the control vary:

```jsx
<Field id="bio" label="Bio" error={errors.bio}>
  <textarea id="bio" />
</Field>
```

The label/error/ARIA logic lives in one place; `TextInput`, `Select`,
`Checkbox` and `DatePicker` stay separate components.

## Traps

- **`Math.random()` for ids breaks SSR hydration** — server and client generate
  different values. Use `useId()`.
- **Only validating on submit** hides which field failed on a long form; scroll
  to and focus the first error if you do.
- **Disabling submit until valid** gives no explanation for why it is dead.
  Showing errors is friendlier.
- **Errors that appear and shift the layout** cause CLS — reserve the space.

## How to answer this out loud

"I'd have the field own the label, input, hint and error plus the wiring between
them — `htmlFor`, `aria-describedby`, `aria-invalid`, `role='alert'` — because
that's the part every form gets wrong when it's hand-rolled. For timing I'd
validate on blur and then re-validate on change once the field is touched, so
you're not shouting at someone mid-word but errors clear as soon as they fix
them. And I'd keep it compositional rather than adding a `type` prop for every
control."

## Follow-ups to expect

- *Controlled or uncontrolled?* Uncontrolled + a form library scales better for
  large forms; controlled when you need live feedback.
- *Where does the schema live?* Zod/Yup shared between client and server so
  validation cannot drift.
- *How do you show server errors?* Map them back onto fields by name, and keep a
  form-level slot for errors that belong to no single field.
