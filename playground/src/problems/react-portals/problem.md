# React Portals — use cases and event bubbling

## The short answer

```jsx
createPortal(children, document.body)
```

A portal renders children into a **different DOM node** while keeping them in
the same **React tree**. The component hierarchy is unchanged; only the physical
DOM location differs.

## The problem it solves

A modal rendered inside a card gets trapped by its ancestors' CSS:

```css
.card { overflow: hidden; }        /* clips the modal */
.panel { transform: scale(1); }    /* becomes the containing block for
                                      position: fixed — modal no longer covers
                                      the viewport */
.header { z-index: 10; }           /* creates a stacking context the modal
                                      cannot escape */
```

No amount of `z-index: 99999` fixes these — `overflow`, `transform`, `filter`
and `position` on an ancestor genuinely constrain a descendant. The only
reliable fix is to **not be a descendant**, which is what a portal achieves.

Typical uses: modals, dropdowns, tooltips, toasts, context menus.

## The counter-intuitive part: events still bubble to the React parent

```jsx
<div onClick={() => console.log('parent clicked')}>
  {createPortal(<button>Click me</button>, document.body)}
</div>
```

Clicking that button **fires the parent's `onClick`** — even though in the DOM
the button is a child of `<body>`, nowhere near the div.

React's synthetic events propagate along the **component tree**, not the DOM
tree. So context, handlers and state all keep working exactly as if the portal
were rendered in place, which is usually what you want.

## Where that bites: click-outside

```jsx
// ✗ a document listener sees the REAL DOM position
document.addEventListener('click', (e) => {
  if (!dropdownRef.current.contains(e.target)) close()
})
```

The portalled dropdown content is not inside `dropdownRef`'s DOM subtree, so
this closes the dropdown the moment you click inside it. Fixes: check both the
trigger and the portal node, or rely on React's own event propagation instead of
a native document listener.

## What crosses the boundary and what doesn't

| Works through a portal | Does not |
|---|---|
| Context | CSS inheritance from the original parent |
| State and props | Descendant CSS selectors (`.card p { }`) |
| Refs | Anything positional in the DOM |
| Error boundaries | |
| React event propagation | Native listener propagation |

That CSS row is a real gotcha: styles written as `.modal-host .title { }` stop
applying, because the portal content is no longer inside `.modal-host`.

## A portal is not an accessible dialog

Portals solve **layout**, not semantics. A modal still needs:

- `role="dialog"` and `aria-modal="true"`
- focus moved into it on open, and a focus trap while open
- focus restored to the trigger on close
- `Escape` to dismiss
- the rest of the page marked `aria-hidden`/`inert`

Rendering into `document.body` does none of that for you.

## How to answer this out loud

"A portal renders children into a different DOM node while keeping them in the
same React tree. It exists because `overflow: hidden`, `transform` and stacking
contexts on ancestors will clip or trap a modal no matter what z-index you use.
The surprising part is that events still bubble through the React tree rather
than the DOM tree, so a parent's onClick fires — great for context and handlers,
but it breaks naive click-outside logic that assumes DOM containment."

## Follow-ups to expect

- *Where should the portal target live?* `document.body` is fine; a dedicated
  `<div id="modal-root">` gives you a predictable stacking position.
- *Does SSR work?* `createPortal` needs a DOM node, so guard it or render after
  mount.
- *What about `<dialog>`?* The native element gives you the top layer, focus
  trapping and `::backdrop` without a portal — worth mentioning as the modern
  alternative.
