# Star Rating

A 5-star rating widget with hover preview.

## Requirements

- Hovering a star previews that rating — every star up to and including the
  hovered one fills.
- Moving the pointer off the widget restores the committed rating.
- Clicking a star commits that rating.
- Show the committed rating as text, or "No rating yet".

## How it works

Two pieces of state: the committed `rating`, and a transient `hovered` value.
The displayed value is `hovered || rating` — hover wins while the pointer is
over the widget, and falls back to the real rating once it leaves.

`onMouseLeave` sits on the **container**, not on each star. Putting it on each
star would clear the preview while moving between adjacent stars, making the
fill flicker.
