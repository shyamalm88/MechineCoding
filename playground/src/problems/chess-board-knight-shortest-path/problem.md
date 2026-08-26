# Knight Shortest Path

Fewest knight moves between two squares on a chessboard.

## Requirements

- The knight moves in an L: two squares one way, then one perpendicular.
- Find the minimum number of moves from start to target.
- Display the route taken, not only its length.

## How it works

Each square is a node; each of the eight legal knight moves is an edge. Every
move costs the same, so **BFS** yields the shortest path — the first time a
square is dequeued, it was reached in the minimum number of moves.

Crucially the knight **jumps**: intermediate squares are irrelevant, so each
move is a single edge to a single destination. (Contrast with the Rook, where
one move can span many squares and needs a slide.)

Each square records the square it was reached from, and the path is rebuilt by
walking those links backwards from the target.

## Interview traps

- Using DFS. It finds *a* path, not the *shortest* one.
- Forgetting the visited set — the knight's graph has cycles everywhere.
- Off-by-one board bounds on all eight offsets.
