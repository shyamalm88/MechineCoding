# Rook Shortest Path

Fewest rook moves between two squares, with blocked squares in the way.

## Requirements

- The rook slides any distance horizontally or vertically.
- One slide, however long, counts as **one move**.
- Blocked squares stop a slide; find the minimum number of moves.

## How it works

Still BFS, but the edge definition differs from the Knight's. A single rook
move reaches **every** square along a ray, so expanding a node means sliding in
all four directions and enqueueing each square passed through.

One subtlety worth stating in an interview: when sliding, you must **keep going
through already-visited squares**. A visited square only means "we know the
cheapest way to stop here" — the rook can still pass over it to reach an
unvisited square further along. Stopping the slide at the first visited cell
silently produces wrong answers on some boards.

## Interview traps

- Treating each step of a slide as a separate move — that solves a different
  problem (king/grid distance).
- Halting a slide at a visited square, as above.
- Not stopping *before* a blocked square.
