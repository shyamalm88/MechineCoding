# Tic-Tac-Toe (N x N)

Tic-tac-toe generalised to any board size, where the win length equals the
board dimension.

## Requirements

- Board size comes from the `size` prop (defaults to 5×5) — nothing hardcodes 3.
- Players alternate X and O; a filled cell cannot be replayed.
- A line of `N` marks wins; a full board with no line is a draw.

## How it works

Like Connect 4, win detection runs only from the cell just played, counting
outward in each direction and summing both ways plus the cell itself.

> **Note on this implementation:** it checks **horizontal and vertical only** —
> the `directions` array contains `[0,1]` and `[1,0]`, with no diagonals. On a
> real board a diagonal line therefore does not register as a win. Adding
> `[1,1]` and `[1,-1]` would complete it; the counting logic already handles
> any direction vector unchanged.

## Interview traps

- Hardcoding 3-in-a-row, or the eight classic win lines, fails the moment the
  board is parameterised.
- Draw detection needs a move counter (or a board scan) — "no winner" alone is
  not a draw until the board is full.
