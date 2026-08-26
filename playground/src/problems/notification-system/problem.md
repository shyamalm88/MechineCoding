# Notification System

Toast notifications that stack and auto-dismiss.

## Requirements

- Show a notification with a message and type (info, success, error).
- Each dismisses itself after a time-to-live.
- Notifications can also be dismissed manually, and several can stack.

## How it works

Notifications live in an array; each is given a unique id on creation. A
`setTimeout` per notification schedules its removal, and the timer ids are kept
in a **ref keyed by notification id**.

The ref matters: timers are not render output, and storing them in state would
trigger pointless re-renders while making cleanup racy. Manual dismissal clears
the pending timer before removing the toast, so a later firing timer cannot
remove a *different* notification that has since taken the same array position.

## Interview traps

- **Using array index as identity.** Remove the first toast and every later
  index shifts, so a pending timer dismisses the wrong one. Stable ids fix it.
- Leaking timers by not clearing them on manual dismiss or unmount.
- `Date.now()` as an id collides when two notifications are created in the same
  millisecond — a counter is safer.
