# Why is React fast? What is the Virtual DOM?

## The short answer — and it is not what people expect

**React is not faster than hand-written DOM updates.** A carefully hand-tuned
imperative update will always beat React, because React does strictly *more*
work: it builds a virtual tree, diffs it against the previous one, and only then
touches the DOM.

What React actually gives you is **predictable performance with a declarative
model**. You describe what the UI should look like for a given state; React
works out the updates. You trade a little peak speed for a lot of correctness
and maintainability.

Saying "React is fast because of the Virtual DOM" is the answer interviewers are
listening *for* — as a mistake.

## What the Virtual DOM is

A lightweight JavaScript object tree describing what the UI should look like:

```js
{ type: 'div', props: { className: 'card', children: [ … ] } }
```

On update, React builds a **new** tree, **diffs** it against the previous one,
and produces the minimal set of real DOM operations.

## Why bother diffing at all?

Because real DOM nodes are expensive to work with:

- a DOM element has **hundreds** of properties; a vnode has three or four
- reading layout properties (`offsetHeight`, `getBoundingClientRect`) can force
  a **synchronous reflow**
- unbatched mutations can cause repeated layout/paint work

Comparing plain JS objects is cheap by comparison, and batching the resulting
mutations into one pass avoids layout thrashing. The Virtual DOM is a **buffer**
that lets React be careless about how often *you* re-render while being careful
about how often it touches the DOM.

## The diffing heuristics

A general tree diff is O(n³). React gets O(n) with two assumptions:

1. **Different element types produce different trees.** `<div>` → `<span>` means
   tear down the subtree and rebuild — no attempt to match children.
2. **Keys identify children across renders.** Stable keys let React move nodes
   instead of destroying and recreating them.

Both are covered in depth in the Reconciliation and Keys problem.

## The honest framing

Svelte and Solid skip the Virtual DOM entirely — they compile precise updates at
build time and are measurably faster. If the Virtual DOM were a performance
feature, that would not be possible.

The Virtual DOM is a **means to a declarative programming model**, not a speed
trick. It buys:

- write UI as a function of state, not as a sequence of mutations
- no manual bookkeeping of which node needs which change
- the same code path for first render and every update
- a platform-agnostic tree (React Native renders the same vnodes to native views)

That last point matters: the vnode tree has no dependency on the DOM at all,
which is what makes React Native and other renderers possible.

## Where React genuinely wins on performance

Not from the diff, but from **scheduling**: batching updates into one render,
and (since Fiber) being able to interrupt a long render so the browser can paint
and handle input.

## How to answer this out loud

"The Virtual DOM is a lightweight object tree React diffs against the previous
render to work out minimal DOM operations. But I'd push back on 'React is fast
because of it' — React does more work than a hand-written update; the win is a
declarative model with predictable performance, plus batching so the DOM is
touched once. Svelte and Solid skip the Virtual DOM and are faster, which shows
it's an enabling mechanism rather than a performance feature."

## Follow-ups to expect

- *So when is React slow?* Large unvirtualised lists, expensive renders on every
  keystroke, unstable context values fanning out.
- *What is the Shadow DOM?* Unrelated — a browser encapsulation feature, not a
  React concept. The name similarity is a favourite trick question.
- *What made concurrent rendering possible?* Fiber — reimplementing the tree
  walk so it can be paused and resumed.
