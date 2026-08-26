# Accordion component

Stacked headers that expand and collapse their panels.

## Use a real button

```jsx
<h3><button aria-expanded={isOpen} aria-controls={panelId}>…</button></h3>
```

A `<div onClick>` header is the classic mistake: no focus, no Enter/Space
activation, no announced role. A `<button>` gives all three for free.

Wrapping it in a heading (`<h3>`) matters too — screen-reader users navigate by
heading, and an accordion without headings is invisible to that navigation.

## The ARIA contract

- `aria-expanded` on the **button** — the state.
- `aria-controls` pointing at the panel id.
- `role="region"` + `aria-labelledby` on the panel, so it is announced with the
  name of the header that opened it.

## Hiding the panel

Use the `hidden` attribute (or `display: none`), not `visibility` or opacity.
Content hidden only visually is still focusable and still read aloud — so
keyboard users tab into an invisible panel.

That is the trade-off with animating height: `display: none` cannot be
transitioned. Options are animating `grid-template-rows: 0fr → 1fr`, or
measuring `scrollHeight` and transitioning `max-height`.

## Keyboard

Beyond Enter/Space (free with a button), the WAI-ARIA pattern expects
**Arrow Up/Down** to move between headers, and **Home/End** to jump to first
and last.

## Design decision

Single-open vs multi-open is a genuine product choice, not a bug. Single-open
(true "accordion") is used for space-constrained navigation; multi-open suits
FAQs where users compare answers. Expose it as a prop rather than hardcoding.

## Related

`<details>`/`<summary>` gives you most of this natively with zero JavaScript,
including keyboard and semantics — worth mentioning before writing 80 lines.
