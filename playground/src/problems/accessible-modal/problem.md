# Accessible modal with focus trap

Rendering a centred box is the easy 10%. The accessibility contract is the
question.

## The full checklist

1. **Move focus in** on open — to the first focusable element or the dialog.
2. **Trap Tab** so focus cycles within the dialog and never escapes.
3. **Restore focus** to the triggering element on close. Skipping this dumps
   keyboard users back at the top of the document.
4. **Escape closes.**
5. `role="dialog"` + **`aria-modal="true"`**.
6. `aria-labelledby` / `aria-describedby` pointing at the title and description.
7. Render in a **portal** so no ancestor's `overflow: hidden`, `transform`, or
   `z-index` can clip it.
8. Click on the backdrop (but not inside) closes.

## How the trap works

Query the focusable elements, and on Tab at the boundary, wrap:

```js
if (e.shiftKey && active === first) { e.preventDefault(); last.focus() }
if (!e.shiftKey && active === last) { e.preventDefault(); first.focus() }
```

**Re-query on every Tab** rather than caching the list — dialog contents change,
and a stale list traps focus on elements that no longer exist.

Filter out hidden elements (`offsetParent !== null`), or focus jumps to
something invisible.

## Details that catch people

- Use **`onMouseDown`** for backdrop dismissal, not `onClick`. With `click`, a
  drag that starts inside the dialog and releases on the backdrop closes it —
  which happens constantly when selecting text.
- Screen readers can still reach background content unless it is hidden;
  production dialogs also set `aria-hidden="true"` (or `inert`) on the rest of
  the page.
- Lock body scroll while open, or the page scrolls behind the dialog.

## The modern answer

`<dialog>` with `showModal()` provides focus trapping, Escape, the top layer,
and the `::backdrop` pseudo-element natively. Mentioning it — and that focus
*restoration* and scroll locking still need attention — is a stronger answer
than 100 lines of hand-rolled trap.
