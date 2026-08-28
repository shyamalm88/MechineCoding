# Shadow DOM and Web Components

## The short answer

Three separate browser specs usually discussed together:

1. **Custom Elements** — define your own tags with lifecycle callbacks
2. **Shadow DOM** — an encapsulated subtree with **scoped styles**
3. **HTML Templates** — `<template>` / `<slot>` for inert, reusable markup

```js
class MyCard extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = `<style>p { color: red }</style><slot></slot>`
  }
}
customElements.define('my-card', MyCard)   // name MUST contain a hyphen
```

The hyphen is required so custom elements can never collide with future
built-ins.

## What encapsulation actually means

That `p { color: red }` affects **only this component**. Not other paragraphs on
the page, and page styles do not leak in.

No BEM, no CSS Modules, no build step — real scoping enforced by the browser.
That is the headline feature, and it is genuinely stronger than anything CSS-in-JS
gives you.

**Deliberate exceptions** exist so components are still themeable:

```css
my-card { --card-bg: navy; }        /* custom properties DO pierce the boundary */
my-card::part(header) { … }         /* ::part() exposes chosen internals */
::slotted(p) { … }                  /* style light-DOM content passed in */
```

Custom properties piercing the shadow boundary is *the* supported theming
mechanism — worth knowing, because "how do you theme a web component?" is the
obvious follow-up.

## open vs closed

```js
this.attachShadow({ mode: 'open' })    // el.shadowRoot works
this.attachShadow({ mode: 'closed' })  // el.shadowRoot === null
```

**`closed` is not a security boundary.** Script on the page can still get at it
(by patching `attachShadow`, for one). It signals intent, nothing more —
treating it as protection is a misconception worth correcting.

## Where it hurts

**Forms.** A native input inside a shadow root does **not** participate in an
outer `<form>` — it will not be submitted, and `form.elements` will not see it.
Fixing that requires `static formAssociated = true` and `ElementInternals`.

**Events.** They **retarget** at the shadow boundary — outside listeners see the
host element, not the inner node. Custom events need `composed: true` to escape:

```js
this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
```

**Accessibility.** ARIA relationships **cannot cross the boundary by IDREF** —
an `aria-labelledby` pointing at an id outside the shadow root simply does not
work. This is a real, long-standing limitation.

**SSR.** Declarative Shadow DOM is recent; the hydration story is still weaker
than a framework's.

## Why they lost to frameworks (for apps)

Web Components are excellent for **design systems shipped across frameworks** —
Adobe Spectrum, Shoelace, Salesforce Lightning, GitHub's own elements. Write
once, use in React, Vue, Angular or plain HTML.

For *application* development, React's model won: state-driven rendering, a huge
ecosystem, and better tooling. The imperative DOM API of custom elements is an
awkward fit for reactive data, and passing anything other than a string
attribute requires property access rather than markup.

So the honest framing: **not a competitor to React — a distribution format for
UI primitives**.

## How to answer this out loud

"Web Components are three specs: custom elements, shadow DOM and templates. The
real feature is shadow DOM's style encapsulation — styles inside genuinely don't
leak out or in, enforced by the browser. Custom properties are the deliberate
exception, which is how you theme them. The rough edges are forms — inputs in a
shadow root don't participate unless you implement `formAssociated` — event
retargeting, and ARIA not being able to cross the boundary by id. They've found
their niche as cross-framework design systems rather than as an app framework."

## Follow-ups to expect

- *Is Shadow DOM the same as Virtual DOM?* No, and the name similarity is a
  classic trick question — one is browser encapsulation, the other is a React
  implementation detail.
- *How do you pass an object to a custom element?* Set a property, not an
  attribute — attributes are strings only.
- *What is `<slot>`?* A placeholder where light-DOM children are projected —
  the same idea as React's `children`.
