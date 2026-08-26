# Implement a reusable form field component with validation

## What the component owns

A field component should bundle the things that always travel together: label,
input, error message, and the wiring that links them for assistive tech.

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
        aria-describedby={[hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined}
        {...inputProps}
      />
      {hint && <p id={hintId}>{hint}</p>}
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  )
}
```

The accessibility wiring is the part usually missed: `htmlFor`/`id` pairs the
label, `aria-describedby` associates the error, `aria-invalid` marks the state,
and `role="alert"` announces it when it appears.

## Validation timing

Validating on every keystroke shouts at users while they are still typing.
The usual compromise: **validate on blur, then re-validate on change once the
field has been touched**, so errors clear as soon as they are fixed.

That requires tracking a `touched` flag per field, not just a value and error.

## Composition over configuration

Resist growing one component with `type`, `options`, `multiline`, `mask`… props.
A shared `Field` wrapper that renders `children` keeps the label/error/a11y
logic in one place while `TextInput`, `Select`, and `Checkbox` stay separate.

## Traps

- Generating ids with `Math.random()` breaks SSR hydration — use `useId()`.
- Only showing errors on submit hides which field failed on long forms.
- Disabling the submit button until valid gives no explanation; showing errors
  is friendlier than a dead button.
