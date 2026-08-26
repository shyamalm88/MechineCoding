# WhatsApp-style chat UI

Message list, alignment by sender, composer, typing indicator.

## The scroll behaviour is the real question

Naively scrolling to the bottom on every new message **yanks the user down
while they are reading history** — the single most complained-about bug in chat
UIs.

The fix is to track whether they were already pinned to the bottom:

```js
const pinned = el.scrollHeight - el.scrollTop - el.clientHeight < 40
```

Only auto-scroll when `pinned`. Otherwise leave them alone (and ideally show a
"new messages ↓" affordance).

## useLayoutEffect, not useEffect

Scrolling must happen **before paint**, or the user sees the list render at the
old position and then jump. That is precisely what `useLayoutEffect` is for.

## Layout without JS

Alignment is `justify-content: flex-end` on the row for your own messages —
no measurement, no absolute positioning. The list is a
`flex-direction: column` container so bubbles stack naturally and
`overflow-y: auto` scrolls the whole history.

## Details that get noticed

- **Stable ids** on messages, never index keys — new messages arrive at the end
  and optimistic ones get replaced by server versions.
- `max-width` on the bubble (~75%) so long messages wrap instead of spanning
  the pane.
- Disable Send for whitespace-only input.
- The typing indicator should be **in the list**, so it participates in the same
  scroll logic.

## Follow-ups

- **Virtualisation** for long histories — thousands of bubbles will not stay at
  60fps, and variable heights make it genuinely hard.
- **Optimistic send**: render immediately with a "sending" state, reconcile on
  ack, mark failed with a retry.
- Grouping consecutive messages from the same sender, and date separators.
- Real delivery via WebSocket, with ordering by server timestamp rather than
  arrival.
