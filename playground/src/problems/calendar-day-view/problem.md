# Calendar Day View

Lay out a day's events on a timeline, side by side where they overlap.

## Requirements

- Vertical position and height come from each event's start and end time.
- Overlapping events share the horizontal space instead of covering each other.
- Non-overlapping events use the full width.

## How it works

The two axes are computed independently:

- **Vertical** is a direct mapping from time to pixels.
- **Horizontal** depends on collisions, so events are sorted by start time and
  swept into groups of mutually overlapping events. Each group of `N` events
  gets `width = 100% / N`, and event `i` is offset to `left = i * width`.

## Interview traps

- **Transitive overlap.** A overlaps B, B overlaps C, but A and C do not.
  They must still share width, because the group is defined by the chain — not
  by pairwise overlap. Grouping must track the running maximum end time of the
  group, not just the previous event's end.
- Sorting by end time instead of start time breaks the sweep.
- Zero-length or inverted events (`end <= start`) need an explicit decision.
