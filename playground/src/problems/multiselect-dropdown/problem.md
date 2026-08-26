# Multiselect dropdown with search

A combobox with chips, filtering, and full keyboard support — one of the most
demanding machine-coding prompts because so many small behaviours must all work.

## The behaviours that are graded

- Filter as you type, and **reset the active index** when the query changes
  (otherwise the highlight points at an item that scrolled out of the result set).
- **Arrow Up/Down** move the active option; **Enter** toggles it; **Escape**
  closes.
- **Backspace on an empty query removes the last chip** — the convention every
  real multiselect follows.
- Clicking outside closes the menu.
- The active option **scrolls into view** during keyboard navigation
  (`scrollIntoView({ block: 'nearest' })`).

## Two event-choice traps

**`onMouseDown` with `preventDefault()` on options**, not `onClick`. A `click`
fires after `mousedown` → blur, so the input loses focus and the menu closes
before the selection registers. Preventing default on mousedown keeps focus in
the input.

**`mousedown` for click-outside**, not `click`, so selecting text that ends
outside the component does not dismiss it.

## Selected state

A `Set`, not an array: O(1) membership tests while rendering every option, and
toggling is `has`/`add`/`delete` rather than `indexOf`/`splice`. Remember to
construct a **new** `Set` on each update or React will not re-render.

## ARIA

`role="combobox"` with `aria-expanded` and `aria-controls` on the input;
`role="listbox"` + `aria-multiselectable` on the list; `role="option"` +
`aria-selected` on each item. Options get `tabIndex={-1}` — focus stays in the
input and the *active* option is communicated via `aria-activedescendant`
rather than by moving focus.

## Scale

Beyond a few hundred options the list must be virtualised, and filtering should
be debounced if it hits the network. Mentioning both shows you have thought past
the demo.
