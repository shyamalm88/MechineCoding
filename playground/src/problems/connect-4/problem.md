# Connect 4

Two players drop discs into a 7-column grid; first to line up four in a row
wins.

## Requirements

- Clicking a column drops a disc to the **lowest empty row** in that column.
- Players alternate; the game announces a winner and stops accepting moves.
- Wins count horizontally, vertically, and on both diagonals.

## How it works

Gravity is a single scan from the bottom row upward for the first empty cell.

Win detection avoids rescanning the whole board. Because a win must involve the
disc just played, it only counts outward from that one cell:

```
total = 1 + count(direction) + count(opposite direction)
```

Four directions are checked — horizontal, vertical, and the two diagonals —
each walking outward while cells match the current player. That is O(1) work
per move instead of O(rows × cols).

## Interview traps

- Only checking the four "forward" directions misses wins extending backwards;
  each direction must be counted **both ways** from the placed disc.
- A full board with no winner is a draw — easy to forget.
- Board size is parameterised (`rows`, `cols`), so nothing may hardcode 6×7.
