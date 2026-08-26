# Shadow DOM and Web Components

## The three specs

1. **Custom Elements** — define your own tags with lifecycle callbacks
   (`connectedCallback`, `attributeChangedCallback`).
2. **Shadow DOM** — an encapsulated subtree with its own scoped styles.
3. **HTML Templates** — `<template>`/`<slot>` for inert, reusable markup.

```js
class MyCard extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = `<style>p { color: red }</style><slot></slot>`
  }
}
customElements.define('my-card', MyCard)
```

## What encapsulation actually means

Styles inside a shadow root do not leak out, and outside styles do not leak in.
That `p { color: red }` affects only this component — no BEM, no CSS modules,
no build step required.

Deliberate exceptions: **CSS custom properties pierce the boundary** (the
supported theming mechanism), and `::part()` / `::slotted()` expose chosen
pieces for external styling.

`mode: 'open'` exposes `el.shadowRoot`; `'closed'` returns `null`. Closed is not
a security boundary — script on the page can still get at it.

## Where it hurts

- **Forms.** A native input inside a shadow root does not participate in an
  outer `<form>` unless you implement `formAssociated` with `ElementInternals`.
- **Events.** They retarget at the boundary; `composed: true` is needed for a
  custom event to escape.
- **Accessibility.** ARIA relationships cannot cross the boundary by IDREF, so
  `aria-labelledby` pointing outside simply does not work.
- **SSR.** Declarative Shadow DOM is recent; hydration story is still weaker
  than a framework's.

## Why they lost to frameworks

Web Components are excellent for **design systems shipped across frameworks**
(Adobe Spectrum, Shoelace, Salesforce Lightning). For app development, React's
model — state-driven rendering, ecosystem, tooling — proved more productive,
and the imperative DOM API of custom elements is a poor fit for reactive data.
