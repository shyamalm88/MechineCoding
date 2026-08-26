# Data Table

A table with text filtering, column sorting, and pagination working together.

## Requirements

- The filter box matches against name or role, case-insensitively.
- Clicking a column header sorts by it; clicking the same header again flips
  the direction.
- Results are paginated; page controls reflect the filtered/sorted set.

## How it works

The three operations form a strict pipeline, and **the order matters**:

```
filter  ->  sort  ->  paginate
```

Filtering first means sorting and pagination only ever see relevant rows.
Paginating last means page 2 shows the second page of the *final* result set.
Sorting before filtering would waste work; paginating before filtering would
produce pages with wildly varying sizes.

Note the sort copies the array (`[...filtered].sort()`) — `Array.sort` mutates
in place, and mutating derived state is how subtle rendering bugs start.

## Interview traps

- **Stale page index.** Filtering down to fewer pages while sitting on page 5
  leaves you on an empty page unless the page resets.
- Sorting mixed types (`age` numeric vs `name` string) with one comparator
  works here because `<`/`>` handle both, but it breaks on `null`.
- Derived state should be computed during render, not mirrored into `useState`.
