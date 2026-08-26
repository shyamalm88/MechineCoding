# Semantic HTML and web accessibility basics

## Why semantics beat divs

A `<button>` gives you, for free: keyboard focus, Enter/Space activation, the
correct screen-reader role, and native disabled semantics. A
`<div onClick>` gives you none of them — you must add `role="button"`,
`tabIndex={0}`, and an `onKeyDown` handler for both Enter and Space, and you
will still miss something.

**The first rule of ARIA is: don't use ARIA.** A native element is always
better than a div wearing a role.

## The four principles (POUR)

- **Perceivable** — text alternatives, sufficient contrast (4.5:1 for body
  text), not relying on colour alone.
- **Operable** — everything reachable and usable by keyboard, visible focus,
  no keyboard traps.
- **Understandable** — predictable behaviour, labelled inputs, clear errors.
- **Robust** — valid markup that assistive tech can parse.

## The things most often got wrong

- **Labels.** Every input needs a real `<label for>`; placeholder text is not a
  label — it disappears on typing and is often too low-contrast.
- **Focus management.** Opening a dialog must move focus into it, trap it while
  open, and restore it to the trigger on close.
- **Announcing dynamic changes.** A screen reader will not notice new content
  unless it is in an `aria-live` region.
- **Removing focus outlines.** `outline: none` with no replacement makes a site
  unusable by keyboard. Use `:focus-visible` to style it well instead.
- **Heading order.** Headings are the primary navigation mechanism for screen
  reader users; skipping levels breaks that map.

## Testing

Automated tools (axe, Lighthouse) catch roughly a third of issues. Tab through
the page with the mouse unplugged, and listen to it with VoiceOver or NVDA —
that catches the rest.
