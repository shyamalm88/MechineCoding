# Seat Picker

## Problem Statement

Build a bus/flight seat selection UI. Users click seats to select or deselect them. Pre-booked seats are disabled. A summary shows selected seats and total price. Uber and BookMyShow ask this exact problem.

## Requirements

1. **Grid of seats** — rows A–G, columns 1–8 (adapt for any size)
2. **Three states** — available (green), selected (blue), booked (grey/disabled)
3. **Toggle selection** — click available seat to select, click again to deselect
4. **Booked seats are disabled** — cannot be clicked
5. **Summary panel** — shows selected seat IDs, count, and total price
6. **Clear selection** button

## Key Interview Points

### State: a Set, not an array
```js
const [selected, setSelected] = useState(new Set());

function toggleSeat(id) {
  setSelected(prev => {
    const next = new Set(prev);   // must create new Set for React to detect change
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}
```
Why Set over array: `has()` is O(1), `delete()` is O(1). Array `includes()` + `filter()` is O(n) per click.

### Seat ID scheme
```js
const id = `${row}${col}`; // "A3", "B7" etc.
const BOOKED = new Set(["A3", "B5", ...]); // O(1) lookup
```

### Derive status, don't store it
```js
function getSeatStatus(id, selected) {
  if (BOOKED.has(id)) return "booked";
  if (selected.has(id)) return "selected";
  return "available";
}
```
Status is derived on every render from the single `selected` Set — no separate `bookedSeats` state needed.

### Disabled button = no handler needed
```jsx
<button disabled={status === "booked"} onClick={() => toggleSeat(id)}>
```
`disabled` prevents click events natively — no need for `if (BOOKED.has(id)) return`.

## What interviewers look for

- Set for O(1) lookup (not array)
- New Set on toggle (immutable update pattern)
- Derived status function (not stored separately)
- Correct `disabled` usage
- Summary derived from `selected.size` (no separate counter state)