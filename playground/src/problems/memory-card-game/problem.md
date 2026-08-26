# Memory card matching game

Flip two cards; matches stay up, non-matches flip back.

## The state model

Three pieces, and choosing them well makes the logic almost trivial:

- `deck` — shuffled cards, each with a stable **id** (not just an emoji, since
  every emoji appears twice)
- `flipped` — the ids currently face-up (length 0, 1, or 2)
- `matched` — a `Set` of emoji already solved

Face-up is **derived**, not stored: `flipped.includes(id) || matched.has(emoji)`.
Storing an `isFlipped` flag per card as well means two sources of truth that
can disagree.

## The bug every implementation hits first

Without an **input lock**, a fast player flips a third card during the
"non-match" pause. `flipped` grows to three, the comparison breaks, and cards
get stuck face-up.

```js
if (locked || flipped.includes(card.id) || matched.has(card.emoji)) return
```

Guard all three: locked, already flipped, already matched.

## Shuffle correctly

```js
arr.sort(() => Math.random() - 0.5)   // ✗ biased, and implementation-dependent
```

An inconsistent comparator gives an unspecified permutation, and empirically the
distribution is badly skewed. **Fisher-Yates** is the correct O(n) shuffle and
is what interviewers look for.

## Cleanup

The flip-back timer lives in an effect and must be cleared on unmount or on
`flipped` changing — otherwise starting a new game while a pause is pending
flips cards in the *new* deck.

## Details

- Count a "move" per *pair* attempted, not per card flipped.
- Cards should be `<button>`s for keyboard play, with an `aria-label` that does
  not leak the hidden value.
- CSS flip animation needs `transform-style: preserve-3d` plus
  `backface-visibility: hidden` on two stacked faces — omitted here to keep the
  logic prominent.
