# renderDom: build DOM from a virtual node object

Turn `{ type, props: { children } }` into real DOM. This is exactly what a
framework does between "create element" and "commit".

## The cases that must be handled separately

```js
if (typeof vnode === 'string' || typeof vnode === 'number')
  return document.createTextNode(String(vnode))
```

**`createTextNode`, never `innerHTML`.** Text must never be parsed as markup —
that is the XSS boundary, and it is the security point of the question.

## Props are not all attributes

- `className` → the attribute is actually `class`
- `style` object → assign onto `el.style`, not `setAttribute('style', [object Object])`
- `onClick` → `addEventListener('click', …)`, lowercasing after stripping `on`
- **Booleans** → present or absent. `setAttribute('disabled', false)` renders
  `disabled="false"`, which is still **truthy** to the browser and disables the
  element. This trips people constantly.
- `children` must be skipped in the prop loop or it is serialised as an attribute.

## Attributes vs properties

`setAttribute` writes the *attribute*; some things only work as *properties*.
`input.value` is the classic case: after a user types, the `value` attribute
still holds the original, while the property holds the current text. Frameworks
maintain a list of which names to set as properties.

## Children

Flatten nested arrays (`children.flat(Infinity)`) so `[a, [b, c]]` works — a
map inside a tree produces exactly that shape. Skip `null`, `undefined`, and
booleans, which is how `{cond && <X/>}` renders nothing.

## Where this sits in a framework

This is only the *create* half. The other half is **diffing** — comparing two
vnode trees and applying the minimal set of mutations, plus keyed reconciliation
so list reorders move nodes instead of recreating them. Naming that boundary
shows you understand what the exercise is a piece of.
