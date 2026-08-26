# Snakes and Ladders

Find the minimum number of dice throws needed to reach square 100.

## Requirements

- Model the board as a graph and compute the fewest moves to the final square.
- Snakes and ladders teleport you on arrival.
- Show the actual sequence of squares, not just the move count.

## How it works

The board is a **directed graph**: from square `X` there are edges to
`X+1 … X+6` (the six dice outcomes). Landing on a snake or ladder immediately
redirects to its destination.

Every dice throw costs exactly 1, so all edges have equal weight — which makes
**BFS** optimal. The first time BFS reaches a square, it has reached it in the
fewest possible throws; no weighting or priority queue is needed.

The path is reconstructed by carrying the route along in the queue.

## Interview traps

- Reaching for Dijkstra. It works, but it is unnecessary machinery when every
  edge weight is 1 — BFS is the right tool.
- Forgetting that the jump itself is free: the dice roll counts as one move,
  the snake/ladder that follows does not.
- Not marking squares visited turns this into an exponential walk.
