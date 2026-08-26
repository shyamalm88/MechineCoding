# Pagination component

`1 … 4 5 6 … 20` — a fixed-width control regardless of page count.

## Keep the page-list logic pure

The window arithmetic is the fiddly part and belongs in its own function, away
from JSX, so it can be tested directly:

```js
buildPages(current, total, siblings)  // → [1, '…', 4, 5, 6, '…', 20]
```

## The detail that separates implementations

**Only show an ellipsis when it hides more than one page.** Rendering
`1 … 3 4 5` when the `…` stands for just page 2 is worse than showing `1 2 3 4 5` —
same width, one fewer click.

```js
const showLeftDots = left > 2      // not `left > 1`
```

## Constant width

Reserve a fixed number of slots (`siblings * 2 + 5`: first, last, current, two
sibling groups, two ellipses). Without this the control jumps around as the user
pages through, which is visually jarring and moves the button under their cursor.

## Accessibility

- Wrap in `<nav aria-label="Pagination">`.
- Mark the active page with **`aria-current="page"`**, not just a CSS class —
  colour alone is not an accessible state.
- Ellipses are decorative: `aria-hidden="true"`.
- Use real `<button>`s so keyboard and screen readers work.

## Offset vs cursor pagination

Worth raising as a follow-up:

- **Offset** (`?page=3&limit=20`) allows jumping to an arbitrary page, but is
  slow on large tables (`OFFSET 100000` scans everything) and **skips or
  duplicates rows** when the underlying data changes between requests.
- **Cursor** (`?after=abc123`) is stable and fast, but only supports
  next/previous — you cannot render numbered pages, because you do not know the
  total.

That trade-off is precisely why infinite-scroll feeds use cursors and admin
tables use offsets.

## Traps

- Reducing the total page count while sitting on a high page leaves you past the
  end — clamp `page` whenever `total` changes.
- Disable rather than hide Prev/Next at the boundaries, so the layout is stable.
